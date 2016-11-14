-module(module_PublicFunction).

-export([fun_func/0]).

-import(loa_runtime, [function/4, literal_Int/1]).
-import(module_Loa_Core, [type_Int/0]).

fun_func() -> function("func", [], type_Int(), fun() ->
  literal_Int(123)
end).
