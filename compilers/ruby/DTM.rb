# 图灵机(Turing Machine, TM), 能访问一条无限长纸带的有限状态自动机
# 这个名字通常指一条拥有确定性规则的机器, 也叫确定型图灵机(Deterministic Turing Machine, DTM)

class Tape < Struct.new(:left, :middle, :right, :blank)
  def inspect
    "#<Tape #{left.join}(#{middle})#{right.join}>"
  end

  def write(character)
    Tape.new(left, character, right, blank)
  end

  def move_head_left
    Tape.new(left[0..-2], left.last || blank, [middle] + right, blank)
  end

  def move_head_right
    Tape.new(left + [middle], right.first || blank, right.drop(1), blank)
  end
end

class TMConfiguration < Struct.new(:state, :tape) 

end

class TMRule < Struct.new(:state, :character, :next_state, :write_character, :direction)

  def applies_to?(configuration)
    state == configuration.state && character == configuration.tape.middle
  end 
end

tape = Tape.new(['1', '0', '1'], '1', [], '_')

tape
tape.move_head_left
tape.write('0')

rule = TMRule.new(1, '0', 2, '1', :right)

rule.applies_to?(TMConfiguration.new(1, Tape.new([], '0', [], '_')))