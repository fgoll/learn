# 确定性有限自动机(Deterministic Finite Automaton, DFA)

# 确定性: 
#   没有冲突: 一个状态对于同样的输入, 不能有多个规则
#   没有遗漏: 每个状态都必须针对每个可能的输入字符有至少一个规则

class FARule < Struct.new(:state, :character, :next_state)
  def applies_to?(state, character) 
    self.state == state && self.character == character
  end

  def follow
    next_state
  end

  def inspect
    "#<FARule #{state.inspect} --#{character} --> #{next_state.inspect}>"
  end
end

class DFARulebook < Struct.new(:rules)
  def next_state(state, character)
    rule_for(state, character).follow
  end

  def rule_for(state, character)
    rules.detect { |rule| rule.applies_to?(state, character) }
  end
end

class DFA < Struct.new(:current_state, :accept_states, :rulebook)
  def accepting?
    accept_states.include?(current_state)
  end

  def read_character(character)
    self.current_state = rulebook.next_state(current_state, character)
  end

  def read_string(string)
    string.chars.each do |character|
      read_character(character)
    end
  end
end

class DFADesign < Struct.new(:start_state, :accept_states, :rulebook)
  def to_dfa
    DFA.new(start_state, accept_states, rulebook)
  end

  def accepts?(string)
    # dfa = to_dfa
    # dfa.read_string(string)
    # dfa.accepting?
    to_dfa.tap { |dfa| dfa.read_string(string) }.accepting?
  end
end

rulebook = DFARulebook.new([
  FARule.new(1, 'a', 2), FARule.new(1, 'b', 1),
  FARule.new(2, 'a', 2), FARule.new(2, 'b', 3),
  FARule.new(3, 'a', 3), FARule.new(3, 'b', 3)
])

rulebook.next_state(1, 'a')
rulebook.next_state(1, 'b')
rulebook.next_state(2, 'b')


dfa = DFA.new(1, [3], rulebook)
dfa.accepting?
# dfa.read_character('b')
# dfa.accepting?
# 3.times do dfa.read_character('a') end
# dfa.accepting?
# dfa.read_character('b')
# dfa.accepting?

dfa.read_string('baaab')
dfa.accepting?

dfa_design = DFADesign.new(1, [3], rulebook)

dfa_design.accepts?('a')

dfa_design.accepts?('babba')

# UTM (Universal Turing Machine, 通用图灵机), 能从纸带读取规则、接受状态以及起始配置然后单步执行，模拟任何其他确定型图灵机，
# 本质上这扮演着图灵机规则手册解释器的角色

# 我们可以把单个的规则连到一起表示整个规则手册。
# 类似地，可以通过把它当前状态的表 示和它当前纸带内容的表示连在一起，
# 来对所模拟机器的当前配置进行编码。 而且这给了我们想要的：
# 一台完整的图灵机以字符串的形式写在另一台图灵机的纸带上，准备通过 模拟开始自己的生命周期。