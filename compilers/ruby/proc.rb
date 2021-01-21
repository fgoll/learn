#  数字
ZERO = -> p { -> x { x } }
ONE = -> p { -> x { p[x] } }
TWO = -> p { -> x { p[p[x]] } }
THREE = -> p { -> x { p[p[p[x]]] } }
FIVE = -> p { -> x { p[p[p[p[p[x]]]]] } }
FIFTEEN = -> p { -> x { p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[x]]]]]]]]]]]]]]] } }
HUNDRED = -> p { -> x { p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[ p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[ p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[p[x]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] } }

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
POWER = -> m { -> n { n[MULTIPLY[m]][ONE] } }

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

Y = -> f { -> x { f[x[x]] }[-> x { f[x[x]] }] }

Z = -> f { -> x { f[-> y { x[x][y] }] }[-> x { f[-> y { x[x][y] }] }] }

MOD = 
  Z[-> f { -> m { -> n {
    IF[IS_LESS_OR_EQUAL[n][m]][
      -> x {
        f[SUBTRACT[m][n]][n][x]
      }
    ][
      m
    ]
  }}}]

to_integer(MOD[THREE][TWO])
to_integer(MOD[
  POWER[THREE][THREE]
][
  ADD[THREE][TWO]
])

(ONE..HUNDRED).map do |n| 
  IF[IS_ZERO[MOD[n][FIFTEEN]]][ 
    'FizzBuzz' 
  ][IF[IS_ZERO[MOD[n][THREE]]][ 
    'Fizz' 
  ][IF[IS_ZERO[MOD[n][FIVE]]][ 
    'Buzz' 
  ][ 
    n.to_s 
  ]]] 
end

# 列表
EMPTY = PAIR[TRUE][TRUE]
UNSHIFT = -> l { -> x {
  PAIR[FALSE][PAIR[x][l]]
}}
IS_EMPTY = LEFT
FIRST = -> l { LEFT[RIGHT[l]] }
REST = -> l { RIGHT[RIGHT[l]] }

my_list = 
  UNSHIFT[
    UNSHIFT[
      UNSHIFT[EMPTY][THREE]
    ][TWO]
  ][ONE]

to_integer(FIRST[my_list])
to_integer(FIRST[REST[my_list]])
to_integer(FIRST[REST[REST[my_list]]])
to_boolean(IS_EMPTY[my_list])

def to_array(proc)
  array = []

  until to_boolean(IS_EMPTY[proc])
    array.push(FIRST[proc])
    proc = REST[proc]
  end

  array
end

to_array(my_list)

to_array(my_list).map { |p| to_integer(p) }

RANGE = 
  Z[ -> f {
    -> m { -> n {
      IF[IS_LESS_OR_EQUAL[m][n]][
        -> x {
          UNSHIFT[f[INCREMENT[m]][n]][m][x]
        }
      ][
        EMPTY
      ]
    }}
  }]

my_range = RANGE[ONE][FIVE]

to_array(my_range).map { |p| to_integer(p) }

FOLD = 
  Z[ -> f {
    -> l { -> x { -> g {
      IF[IS_EMPTY[l]][
        x
      ][
        -> y {
          g[f[REST[l]][x][g]][FIRST[l]][y]
        }
      ]
    }}}
  }]

MAP = 
  -> k { -> f {
    FOLD[k][EMPTY][
      -> l { -> x { UNSHIFT[l][f[x]] } }
    ]
  }}

  my_list = MAP[RANGE[ONE][FIVE]][INCREMENT]
  to_array(my_list).map { |p| to_integer(p) }

TEN = MULTIPLY[TWO][FIVE]
B = TEN 
F = INCREMENT[B] 
I = INCREMENT[F] 
U = INCREMENT[I] 
ZED = INCREMENT[U]
FIZZ = UNSHIFT[UNSHIFT[UNSHIFT[UNSHIFT[EMPTY][ZED]][ZED]][I]][F] 
BUZZ = UNSHIFT[UNSHIFT[UNSHIFT[UNSHIFT[EMPTY][ZED]][ZED]][U]][B] 
FIZZBUZZ = UNSHIFT[UNSHIFT[UNSHIFT[UNSHIFT[BUZZ][ZED]][ZED]][I]][F]

def to_char(c) 
  '0123456789BFiuz'.slice(to_integer(c))
end

def to_string(s) 
  to_array(s).map { |c| to_char(c) }.join
end

to_char(ZED)

DIV = 
  Z[-> f { -> m { -> n {
    IF[IS_LESS_OR_EQUAL[n][m]][
      -> x {
        INCREMENT[f[SUBTRACT[m][n]][n]][x]
      }
    ][
      ZERO
    ]
  }}}]
PUSH =
  -> l {
    -> x {
      FOLD[l][UNSHIFT[EMPTY][x]][UNSHIFT]
    }
  }

TO_DIGITS =
  Z[-> f { -> n { 
    PUSH[ IF[IS_LESS_OR_EQUAL[n][DECREMENT[TEN]]
    ][ EMPTY ][ 
      -> x { 
        f[DIV[n][TEN]][x] 
      } 
    ] 
  ][MOD[n][TEN]] } }]

to_array(TO_DIGITS[FIVE]).map { |p| to_integer(p) }

to_string(TO_DIGITS[FIVE])
to_string(TO_DIGITS[POWER[FIVE][THREE]])

solution = 
  MAP[RANGE[ONE][HUNDRED]][-> n { 
    IF[IS_ZERO[MOD[n][FIFTEEN]]][ 
      FIZZBUZZ 
    ][IF[IS_ZERO[MOD[n][THREE]]][ 
      FIZZ 
    ][IF[IS_ZERO[MOD[n][FIVE]]][ 
      BUZZ 
    ][ 
      TO_DIGITS[n] 
    ]]] 
  }]
  to_array(solution).each do |p| puts to_string(p) end; nil