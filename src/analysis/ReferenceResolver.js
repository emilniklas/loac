import * as ast from '../ast'
import * as ir from '../ir'
import ReferenceBinding from './ReferenceBinding'
import OptimizerError from '../errors/OptimizerError'
import Traverser from '../Traverser'

export default class ReferenceResolver {
  constructor (node, bindings) {
    this.node = node
    this.bindings = bindings
    this.declarations = [[]]
    this.level = 0
  }

  static resolve (node, bindings = []) {
    const instance = new ReferenceResolver(node, bindings)
    instance._resolve()
    return instance.bindings
  }

  _resolve () {
    // First pass to recognize outmost scope identifiers,
    // which don't need to be ordered
    Traverser.traverse(this.node, (node) => {
      switch (node.constructor) {
        case ast.Program:
          this._levelUp()
          break
        case ast.TopLevelDeclaration:
          const dec = node.declaration
          switch (dec.constructor) {
            case ast.InterfaceDeclaration:
            case ast.FunctionDeclaration:
              this._declaration(dec.identifier, node.visibility)
              break
            case ast.ConstantDeclaration:
              this._declaration(dec.assignment.pattern, node.visibility)
              break
          }
      }
      return node
    })

    Traverser.traverse(this.node, (node) => {
      switch (node.constructor) {
        case ast.UseStatement:
          this._declaration(node.qualifiedIdentifier)
          break
        case ast.NamePattern:
          this._declaration(node)
          break
        case ast.ValueExpression:
        case ast.TypeReference:
          this._reference(node)
          break
        case ast.BlockFunctionBody:
          this._levelUp()
          break
      }
      return node
    }, (node) => {
      switch (node.constructor) {
        case ast.BlockFunctionBody:
        case ast.Program:
          this._levelDown()
          break
      }
      return node
    })
  }

  _declaration (declaration, visibility = null) {
    const duplicate = this.declarations[this.level]
      .filter((binding) =>
        binding.hasDeclaration(declaration)
      ).length > 0

    if (duplicate) {
      return
    }

    this.declarations[this.level].push(
      new ReferenceBinding(declaration, null, visibility)
    )
  }

  _reference (reference) {
    for (let level = this.level; level >= 0; level--) {
      const bindings = this.declarations[level]
      for (let i = bindings.length - 1; i >= 0; i--) {
        const binding = bindings[i]
        if (binding.declarationMatchesReference(reference)) {
          this.bindings.push(
            binding.bind(reference)
          )
          return
        }
      }
    }
    this.bindings.push(
      new ReferenceBinding(null, reference)
    )
  }

  _levelUp () {
    this.level++
    this.declarations.push([])
  }

  _levelDown () {
    this.bindings.push(
      ...this._unusedOnCurrentLevel()
    )
    this.level--
    this.declarations.pop()
  }

  _unusedOnCurrentLevel () {
    return this.declarations[this.level]
      .filter((declaration) =>
        this.bindings.filter((binding) =>
          binding.hasDeclaration(declaration.declaration)
        ).length === 0
      )
  }
}
