# Compiling

When compiling a module, give code and a hashmap/object with keys = module names, values =
array of functions, where each of those functions return a promise of a string containing
Loa code.

```
public compile (
  filename: String
  code: String
  modules: [
    String: [
      () -> *String
    ]
  ]
)
```

1. Create some registry [String: Module] where type Module = [Program].
2. Parse the code using the filename to generate token locations.
3. Add the AST to the registry.
4. During analysis, pull in any external module.
5. Parse each file of the external module recursively.
6. Once all references are straightened out, optimize.
7. Generate code for the entry point code.

# Linking

1. Somehow get a HashMap of all compiled modules and their generated code.
  - [String: Module] where type Module = [String]
2. Take different steps for JavaScript and Erlang
  - JavaScript:
    1. Run all JS scripts through Babel
    2. Concatenate all files (pay attention to cycle dependencies)
    3. Wrap in runtime script
    4. Return everything as String
  - Erlang
    1. Send everything to erlc
    2. Return as absolute paths to beam files
