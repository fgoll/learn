# Pattern NFA

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

class NFADesign < Struct.new(:start_state, :accept_states, :rulebook)
  def to_nfa
    NFA.new(Set[start_state], accept_states, rulebook)
  end

  def accepts?(string)
    # dfa = to_dfa
    # dfa.read_string(string)
    # dfa.accepting?
    to_nfa.tap { |nfa| nfa.read_string(string) }.accepting?
  end
end

module Pattern
  def bracket(outer_precedence)
    if precedence < outer_precedence
      '(' + to_s + ')'
    else
      to_s
    end
  end

  def inspect
    "/#{self}/"
  end

  def matches?(string)
    to_nfa_design.accepts?(string)
  end
end 

class Empty 

  include Pattern

  def to_s
    ''
  end

  def precedence
    3
  end

  def to_nfa_design
    start_state = Object.new
    accept_states = [start_state]
    rulebook = NFARulebook.new([])

    NFADesign.new(start_state, accept_states, rulebook)
  end

end

class Literal < Struct.new(:character)

  include Pattern

  def to_s
    character
  end

  def precedence
    3
  end


  def to_nfa_design
    start_state = Object.new
    accept_state = Object.new

    rule = FARule.new(start_state, character, accept_state)
    rulebook = NFARulebook.new([rule])

    NFADesign.new(start_state, [accept_state], rulebook)
  end

end

class Concatenate < Struct.new(:first, :second)
  include Pattern

  def to_s
    [first, second].map { |pattern| pattern.bracket(precedence) }.join
  end

  def precedence
    1
  end

  def to_nfa_design
    first_nfa_design = first.to_nfa_design
    second_nfa_design = second.to_nfa_design

    start_state = first_nfa_design.start_state
    accept_states = second_nfa_design.accept_states
    rules = first_nfa_design.rulebook.rules + second_nfa_design.rulebook.rules
    extra_rules = first_nfa_design.accept_states.map { |state| FARule.new(state, nil, second_nfa_design.start_state) }
    rulebook = NFARulebook.new(rules + extra_rules)

    NFADesign.new(start_state, accept_states, rulebook)
  end
end

class Choose < Struct.new(:first, :second)
  include Pattern

  def to_s
    [first, second].map { |pattern| pattern.bracket(precedence) }.join('|')
  end

  def precedence
    0
  end

  def to_nfa_design
    first_nfa_design = first.to_nfa_design
    second_nfa_design = second.to_nfa_design

    start_state = Object.new
    accept_states = first_nfa_design.accept_states + second_nfa_design.accept_states
    rules = first_nfa_design.rulebook.rules + second_nfa_design.rulebook.rules
    extra_rules = [first_nfa_design, second_nfa_design].map { |nfa_design| 
      FARule.new(start_state, nil, nfa_design.start_state)
    }
    rulebook = NFARulebook.new(rules + extra_rules)

    NFADesign.new(start_state, accept_states, rulebook)
  end
end

class Repeat < Struct.new(:pattern)
  include Pattern

  def to_s
    pattern.bracket(precedence) + "*"
  end

  def precedence
    2
  end

  def to_nfa_design
    pattern_nfa_design = pattern.to_nfa_design

    start_state = Object.new
    accept_states = pattern_nfa_design.accept_states + [start_state]
    rules = pattern_nfa_design.rulebook.rules
    extra_rules = pattern_nfa_design.accept_states.map { |accept_state| 
      FARule.new(accept_state, nil, pattern_nfa_design.start_state)
    } + [FARule.new(start_state, nil, pattern_nfa_design.start_state)]
    rulebook = NFARulebook.new(rules + extra_rules)

    NFADesign.new(start_state, accept_states, rulebook)
  end
end

nfa_design = Empty.new.to_nfa_design

nfa_design.accepts?('')

nfa_design.accepts?('a')

nfa_design = Literal.new('a').to_nfa_design

nfa_design.accepts?('')

nfa_design.accepts?('a')

nfa_design.accepts?('b')

Empty.new.matches?('a')

pattern = Concatenate.new(
  Literal.new('a'), 
  Concatenate.new(Literal.new('b'), Literal.new('c'))
)

pattern.matches?('a')
pattern.matches?('ab')
pattern.matches?('abc')

pattern = Choose.new(Literal.new('a'), Literal.new('b'))

pattern.matches?('a')
pattern.matches?('')

pattern = Repeat.new(Literal.new('a'))

pattern.matches?('')

pattern = Repeat.new(
  Concatenate.new(
    Literal.new('a'),
    Choose.new(Empty.new, Literal.new('b'))
  )
)

pattern.matches?('')
pattern.matches?('abaab')
pattern.matches?('abba')