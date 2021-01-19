#  数字
ZERO = -> p { -> x { x } }
ONE = -> p { -> x { p[x] } }
TWO = -> p { -> x { p[p[x]] } }
THREE = -> p { -> x { p[p[p[x]]] } }

def to_integer(proc) 
  proc[-> n { n + 1 }][0]
end

to_integer(ZERO)

to_integer(THREE)

# 布尔值
TRUE = -> x { -> y { x } }
FALSE = -> x { -> y { y } }

def to_boolean(proc) 
  proc[true][false]
end

to_boolean(TRUE)

to_boolean(FALSE)

# IF = 
#   -> b {
#     -> x {
#       -> y {
#         b[x][y]
#       }
#     }
#   }

# IF = -> b { -> x { b[x] } }

IF = -> b { b }

IF[TRUE]['happy']['sad']
IF[FALSE]['happy']['sad']

# 谓词
IS_ZERO = -> n { n[ -> x { FALSE }][TRUE] }

to_boolean(IS_ZERO[ZERO])
to_boolean(IS_ZERO[THREE])

# 有序对
PAIR = -> x { -> y { -> f { f[x][y] } } }
LEFT = -> p { p[-> x { -> y { x } }] }
RIGHT = -> p { p[-> x { -> y { y } }] }

pair = PAIR[ONE][THREE]
to_integer(LEFT[pair])
to_integer(RIGHT[pair])

# 数值运算
INCREMENT = -> n { -> p { -> x { p[n[p][x]] } }}
SLIDE = -> p { PAIR[RIGHT[p]][INCREMENT[RIGHT[p]]] }
DECREMENT = -> n { LEFT[n[SLIDE][PAIR[ZERO][ZERO]]] }
ADD = -> m { -> n { n[INCREMENT][m] } }
SUBTRACT = -> m { -> n { n[DECREMENT][m] } }
MULTIPLY = -> m { -> n { n[ADD[m]][ZERO] }}
POWER = -> m { -> n { n[MULTIPLE[m]][ONE] } }

to_integer(INCREMENT[ONE])

IS_LESS_OR_EQUAL = 
  -> m { -> n {
    IS_ZERO[SUBTRACT[m][n]]
  }}

MOD = 
  -> m { -> n {
    IF[IS_LESS_OR_EQUAL[n][m]][
      -> x {
        MOD[SUBTRACT[m][n]][n][x]
      }
    ][
      m
    ]
  }}
