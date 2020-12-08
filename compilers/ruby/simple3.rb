# 指称语义(关心从程序本来的语言到其他表示的转换)

# 操作语义(小步&大步语义)通过为一种语言设计一个解释器来解释这种语义的含义
# 而语言到语言的指称语义更像是一个编辑器, #to_ruby实现高效的把Simple编译为Ruby

class Number < Struct.new(:value) 
  def to_ruby
    "-> e { #{value.inspect} }"
  end

end

class Boolean < Struct.new(:value)
  def to_ruby
    "-> e { #{value.inspect} }"
  end
end

class Variable < Struct.new(:name) 

  def to_ruby
    "-> e { e[#{name.inspect}] }"
  end

end


class Add < Struct.new(:left, :right) 
  def to_ruby
    "-> e { (#{left.to_ruby}).call(e) + (#{right.to_ruby}).call(e) }"
  end
end

class Multiply < Struct.new(:left, :right)
  def to_ruby
    "-> e { (#{left.to_ruby}).call(e) * (#{right.to_ruby}).call(e) }"
  end
end


class LessThan < Struct.new(:left, :right) 
  def to_ruby
    "-> e { (#{left.to_ruby}).call(e) < (#{right.to_ruby}).call(e) }"
  end
end

class DoNothing
  def to_s
    'do-nothing'
  end

  def inspect
    "《#{self}》"
  end

  def ==(other_statement)
    other_statement.instance_of?(DoNothing)
  end

  def to_ruby
    "-> e { e }"
  end

end

class Assign < Struct.new(:name, :expression) 
 
  def to_ruby
    "-> e { e.merge({ #{name.inspect} => (#{expression.to_ruby}).call(e) }) }"
  end

end

class If < Struct.new(:condition, :consequence, :alternative) 
  def to_s
    "if (#{condition}) { #{consequence} } else { #{alternative} }"
  end

  def inspect
    "《#{self}》"
  end

  def to_ruby
    "-> e { 
      if (#{condition.to_ruby}).call(e)
      then (#{consequence.to_ruby}).call(e)
      else (#{alternative.to_ruby}).call(e)
      end
     }"
  end

end

class Sequence < Struct.new(:first, :second)
  def to_s
    "#{first}; #{second}"
  end

  def inspect
    "《#{self}》"
  end
  
  def to_ruby
    "-> e { 
      (#{second.to_ruby}).call((#{first.to_ruby}).call(e))
    }"
  end

end

class While < Struct.new(:condition, :body) 
  def to_s
    "while (#{condition}) { #{body} }"
  end

  def inspect
    "《#{self}》"
  end

  def to_ruby
    "-> e {
     while (#{condition.to_ruby}).call(e)
      e = (#{body.to_ruby}).call(e)
     end
     e
    }"
  end

end

proc = eval(Number.new(5).to_ruby)
proc.call({})

expression = Variable.new(:x)
expression.to_ruby
proc = eval(expression.to_ruby)
proc.call({x:7})

environment = { x: 3 }

proc = eval(Add.new(Variable.new(:x), Number.new(1)).to_ruby)

proc.call(environment)

proc = eval(
  LessThan.new(Add.new(Variable.new(:x), Number.new(1)), Number.new(3)).to_ruby
)

statement = Assign.new(:y, Add.new(Variable.new(:x), Number.new(1)))

proc = eval(statement.to_ruby)

proc.call({ x: 3 })

proc.call(environment)

statement = While.new(
  LessThan.new(Variable.new(:x), Number.new(5)),
  Assign.new(:x, Multiply.new(Variable.new(:x), Number.new(3)))
)

statement.to_ruby

proc = eval(statement.to_ruby)

proc.call({ x: 1 })