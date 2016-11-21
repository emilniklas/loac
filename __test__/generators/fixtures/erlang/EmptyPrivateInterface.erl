-module(module_EmptyPrivateInterface).

-import(loa_runtime, [type/3, object/1]).

type_MyInterface() -> type("MyInterface", [], #{}).

typeof_MyInterface() -> type("MyInterface", [], #{}).
