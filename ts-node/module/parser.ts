import { codeFrameColumns } from '@babel/code-frame'
import babelTraverse from '@babel/traverse'
import * as babelParser from '@babel/parser'

export function getStringLiteral(node) { 
  const isStringLiteral = node?.type == 'StringLiteral'
  if (!isStringLiteral) return 
  return node?.value
}

export function getImportDefaultSpecifier(node) {
  const isImportDefaultSpecifier = node?.type == 'ImportDefaultSpecifier'
  if (!isImportDefaultSpecifier) return 
  const isIdentifier = node.local.type === 'Identifier'
  if (!isIdentifier) return
  const hasName = node.local.name
  if (!hasName) return
  return hasName
}

export function getCallExpression(node, functionName) { 
  const isCallExpression = node?.type == 'CallExpression'
  if (!isCallExpression) return
  const isIdentifier = node?.callee?.type === 'Identifier'
  if (!isIdentifier) return
  const isFunctionName = node?.callee?.name === functionName
  if (!isFunctionName) return
  const isStringLiteral = node?.arguments[0]?.type === 'StringLiteral'
  if (!isStringLiteral) return
  return node?.arguments[0]?.value
}

export function getVariable(node) { 
  const isVariableDeclarator = node?.type == 'VariableDeclarator'
  if (!isVariableDeclarator) return
  return node.id?.name
}

export function getDeclared(node, variable) { 
  const isIdentifier = node.type === 'Identifier'
  if (!isIdentifier) return
  const isUsed = variable.includes(node?.name) || variable === node?.name
  if (!isUsed) return
  return node?.name
}

export function parser(code: string) {
  const error = (node, message) => { 
    const line = node.loc.start.line
    return `${line}: ${message}\n` + codeFrameColumns(code, node.loc, { linesAbove: 0, linesBelow: 0 })
  }
  let safety = 0
  const VALID_LIBS = ['url-import', '@reggi/url-import']
  const nodes = babelParser.parse(code, {
    plugins: ['typescript'],
    sourceType: 'module'
  })
  let urlImportVariable: string
  let urlImportModule: string
  const requires: string[] = []
  const imports: string[] = []
  const urlImports: string[] = []

  babelTraverse(nodes, {
    ImportDeclaration: (path) => { 
      const module = getStringLiteral(path.node.source)
      if (module) imports.push(module)

      path.node.specifiers.forEach(specifier => { 
        const variable = getImportDefaultSpecifier(specifier)
        if (VALID_LIBS.includes(module) && !variable) {
          throw new Error(error(specifier, `Module required "${module}" must have a default assigment`))
        }
        if (VALID_LIBS.includes(module) && variable) {
          if (urlImportVariable) { 
            throw new Error(error(specifier, `Duplicate URL-IMPORT variable detected "${variable}" and "${urlImportVariable}", please use one`))  
          }
          if (urlImportModule) { 
            throw new Error(error(specifier, `Duplicate URL-IMPORT module detected "${module}" and "${urlImportModule}", please use one`))  
          }
          urlImportModule = module
          urlImportVariable = variable
        }
      })
    },
    CallExpression: (path) => {
      const module = getCallExpression(path.node, 'require')
      if (module) requires.push(module)

      const variable = getVariable(path.container)
      if (VALID_LIBS.includes(module) && !variable) {
        throw new Error(error(path.node, `Module required "${module}" must have a variable assigment`))
      }
      if (VALID_LIBS.includes(module) && variable) {
        if (urlImportVariable) { 
          throw new Error(error(path.node, `Duplicate URL-IMPORT variable detected "${variable}" and "${urlImportVariable}", please use one`))  
        }
        if (urlImportModule) { 
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
      if (urlImport) urlImports.push(urlImport)
    },
    VariableDeclaration: (path) => {
      path.node.declarations.forEach(dec => { 
        const usage = getDeclared(dec.id, urlImportVariable)
        if (usage && safety > 0) {
          throw new Error(error(path.node, `No redeclare URI-IMPORT variable "${urlImportVariable}"`))
        }
        safety++
      })
    },
    AssignmentExpression: (path) => {
      const usage = getDeclared(path.node.left, urlImportVariable)
      if (usage) { 
        throw new Error(error(path.node, `No reassign URI-IMPORT variable "${urlImportVariable}"`))
      }
    }
  })

  return { requires, imports, urlImports }
}
