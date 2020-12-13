# 非确定性有限自动机

require 'set'


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

class NFARulebook < Struct.new(:rules)
  def next_states(states, character) 
    states.flat_map { |state| follow_rules_for(state, character) }.to_set
  end

  def follow_rules_for(state, character) 
    # rules_for(state, character).map{ |rule| rule.follow }
    rules_for(state, character).map(&:follow) 
  end

  def rules_for(state, character) 
    rules.select { |rule| rule.applies_to?(state, character) }
  end

  def follow_free_moves(states)
    more_states = next_states(states, nil)

    if (more_states.subset?(states))
      states
    else
      follow_free_moves(states + more_states)
    end
  end
end

class NFA < Struct.new(:current_states, :accept_states, :rulebook) 
  def current_states
    rulebook.follow_free_moves(super)
  end

  def accepting?
    (current_states & accept_states).any?
  end

  def read_character(character)
    self.current_states = rulebook.next_states(current_states, character)
  end

  def read_string(string)
    string.chars.each do |character|
      read_character(character)
    end
  end
end

class NFADesign < Struct.new(:start_states, :accept_states, :rulebook)
  def to_nfa
    NFA.new(start_states, accept_states, rulebook)
  end

  def accepts?(string)
    # dfa = to_dfa
    # dfa.read_string(string)
    # dfa.accepting?
    to_nfa.tap { |nfa| nfa.read_string(string) }.accepting?
  end
end

# rulebook = NFARulebook.new([
#   FARule.new(1, 'a', 1), FARule.new(1, 'b', 1), FARule.new(1, 'b', 2),
#   FARule.new(2, 'a', 3), FARule.new(2, 'b', 3),
#   FARule.new(3, 'a', 4), FARule.new(3, 'b', 4)
# ])

# rulebook.next_states(Set[1, 4], 'b')


# nfa = NFA.new(Set[1], [4], rulebook)
# nfa.accepting?

# nfa.read_character('b')
# nfa.accepting?
# nfa.read_character('a')
# nfa.accepting?
# nfa.read_character('b')
# nfa.accepting?
# nfa.read_character('b')
# nfa.accepting?

# nfa_design = NFADesign.new(Set[1], [4], rulebook)
# nfa_design.accepts?('bab')
# nfa_design.accepts?('bbbbbd')
# nfa_design.accepts?('bbabb')

rulebook = NFARulebook.new([
  FARule.new(1, nil, 2), 
  FARule.new(1, nil, 4),
  FARule.new(2, 'a', 3),
  FARule.new(3, 'a', 2),
  FARule.new(4, 'a', 5),
  FARule.new(5, 'a', 6),
  FARule.new(6, 'a', 4)
])

nfa_design = NFADesign.new(Set[1], [2, 4], rulebook)
nfa_design.accepts?('aa')
nfa_design.accepts?('aaa')
nfa_design.accepts?('aaaaa')
nfa_design.accepts?('aaaaaa')
# rulebook.next_states(Set[1], nil)