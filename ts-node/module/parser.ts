import { codeFrameColumns } from '@babel/code-frame'
import babelTraverse from '@babel/traverse'
import * as babelParser from '@babel/parser'
import { Node } from '@babel/types'

export function getStringLiteral (node: Node) {
  if (node?.type === 'StringLiteral') {
    if (node?.value !== '') {
      return node?.value
    }
  }
}

export function getImportDefaultSpecifier (node: Node) {
  if (node?.type === 'ImportDefaultSpecifier') {
    if (node.local.type === 'Identifier') {
      if (node.local.name !== '') {
        return node.local.name
      }
    }
  }
}

export function getCallExpression (node: Node, functionName) {
  if (node?.type === 'CallExpression') {
    if (node?.callee?.type === 'Identifier') {
      if (node?.callee?.name === functionName) {
        if (node?.arguments[0]?.type === 'StringLiteral') {
          return node?.arguments[0]?.value
        }
      }
    }
  }
}

export function getVariable (node: Node) {
  if (node?.type === 'VariableDeclarator') {
    if (node?.id?.type === 'Identifier') {
      if (node?.id?.name !== '') {
        return node?.id?.name
      }
    }
  }
}

export function getDeclared (node: Node, variable: string[] | string) {
  if (node.type === 'Identifier') {
    if (variable.includes(node?.name) || variable === node?.name) {
      return node?.name
    }
  }
}

export function parser (code: string) {
  const error = (node: Node, message: string) => {
    const line = node.loc?.start.line
    if (node.loc !== null) {
      const block = codeFrameColumns(code, node.loc, { linesAbove: 0, linesBelow: 0 })
      return [line, ': ', message, '\n ', block].join()
    }
  }
  let safety = 0
  const VALID_LIBS = ['url-import', '@reggi/url-import']
  const nodes = babelParser.parse(code, {
    plugins: ['typescript'],
    sourceType: 'module'
  })
  let urlImportVariable: string | undefined
  let urlImportModule: string | undefined
  const requires: string[] = []
  const imports: string[] = []
  const urlImports: string[] = []

  babelTraverse(nodes, {
    ImportDeclaration: (path) => {
      const module = getStringLiteral(path.node.source)
      if (module === undefined) return
      imports.push(module)

      path.node.specifiers.forEach(specifier => {
        const variable = getImportDefaultSpecifier(specifier)

        if (VALID_LIBS.includes(module) && variable === undefined) {
          throw new Error(error(specifier, `Module required "${module}" must have a default assigment`))
        }
        if (VALID_LIBS.includes(module) && variable !== undefined) {
          if (urlImportVariable !== undefined) {
            throw new Error(error(specifier, `Duplicate URL-IMPORT variable detected "${variable}" and "${urlImportVariable}", please use one`))
          }
          if (urlImportModule !== undefined) {
            throw new Error(error(specifier, `Duplicate URL-IMPORT module detected "${module}" and "${urlImportModule}", please use one`))
          }
          urlImportModule = module
          urlImportVariable = variable
        }
      })
    },
    CallExpression: (path) => {
      const module = getCallExpression(path.node, 'require')
      if (module === undefined) return
      requires.push(module)

      if (Array.isArray(path.container)) return

      const variable = getVariable(path.container)
      if (VALID_LIBS.includes(module) && variable === undefined) {
        throw new Error(error(path.node, `Module required "${module}" must have a variable assigment`))
      }
      if (VALID_LIBS.includes(module) && variable !== undefined) {
        if (urlImportVariable !== undefined) {
          throw new Error(error(path.node, `Duplicate URL-IMPORT variable detected "${variable}" and "${urlImportVariable}", please use one`))
        }
        if (urlImportModule !== undefined) {
          throw new Error(error(path.node, `Duplicate URL-IMPORT module detected "${module}" and "${urlImportModule}", please use one`))
        }
        urlImportModule = module
        urlImportVariable = variable
      }
    }
  })

  babelTraverse(nodes, {
    CallExpression: (path) => {
      const urlImport = getCallExpression(path.node, urlImportVariable)
      if (urlImport !== undefined) urlImports.push(urlImport)
    },
    VariableDeclaration: (path) => {
      path.node.declarations.forEach(dec => {
        if (urlImportVariable === undefined) return
        const usage = getDeclared(dec.id, urlImportVariable)
        if (usage !== undefined && safety > 0) {
          throw new Error(error(path.node, `No redeclare URI-IMPORT variable "${urlImportVariable}"`))
        }
        if (usage !== undefined) {
          safety++
        }
      })
    },
    AssignmentExpression: (path) => {
      if (urlImportVariable === undefined) return
      const usage = getDeclared(path.node.left, urlImportVariable)
      if (usage !== undefined) {
        throw new Error(error(path.node, `No reassign URI-IMPORT variable "${urlImportVariable}"`))
      }
    }
  })

  return { requires, imports, urlImports }
}
