-module(module_EmptyPublicInterface).

-export([type_MyInterface/0]).

-import(loa_runtime, [type/3]).

type_MyInterface() -> type("MyInterface", [], #{}).
