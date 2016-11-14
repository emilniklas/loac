-module(module_HelloWorld_Main_HelloWorld).

-export([type_HelloWorld/0, typeof_HelloWorld/0, object_HelloWorld/0]).

-import(loa_runtime, [type/3, object/1, function/4, call/2, a/2, literal_Int/1]).

-import(module_Loa_Core, [type_Function/2, type_Future/1, type_Unit/0, object_List/0, object_Char/0]).
-import(module_Loa_Env, [type_Main/0, type_Io/0]).

type_HelloWorld() -> type("HelloWorld.Main.HelloWorld", [type_Main()], #{
  main => type_Function(type_Io(), type_Future(type_Unit()))
}).

typeof_HelloWorld() -> type("typeof HelloWorld.Main.HelloWorld", [], #{}).

object_HelloWorld() -> object(#{
  main => function("main", [type_Io()], type_Future(type_Unit()), fun(Val_io) ->
    call(a(Val_io, print), [call(a(call(a(call(a(call(a(call(a(call(a(call(a(call(a(call(a(call(a(call(a(call(a(object_List(), init), []), add), [call(a(object_Char(), init), [literal_Int(72)])]), add), [call(a(object_Char(), init), [literal_Int(101)])]), add), [call(a(object_Char(), init), [literal_Int(108)])]), add), [call(a(object_Char(), init), [literal_Int(108)])]), add), [call(a(object_Char(), init), [literal_Int(111)])]), add), [call(a(object_Char(), init), [literal_Int(32)])]), add), [call(a(object_Char(), init), [literal_Int(87)])]), add), [call(a(object_Char(), init), [literal_Int(111)])]), add), [call(a(object_Char(), init), [literal_Int(114)])]), add), [call(a(object_Char(), init), [literal_Int(108)])]), add), [call(a(object_Char(), init), [literal_Int(100)])])])
  end)
}).
