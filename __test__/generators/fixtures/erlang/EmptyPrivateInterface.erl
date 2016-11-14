-module(module_EmptyPrivateInterface).

-import(loa_runtime, [type/3]).

type_MyInterface() -> type("MyInterface", [], #{}).
