# 词法分析

class LexicalAnalyzer < Struct.new(:string)
  GRAMMAR = [
    { token: 'i', pattern: /if/ }, # if 关键字 
    { token: 'e', pattern: /else/ }, # else 关键字 
    { token: 'w', pattern: /while/ }, # while 关键字 
    { token: 'd', pattern: /do-nothing/ }, # do-nothing 关键字 
    { token: '(', pattern: /\(/ }, # 左小括号 
    { token: ')', pattern: /\)/ }, # 右小括号 
    { token: '{', pattern: /\{/ }, # 左大括号 
    { token: '}', pattern: /\}/ }, # 右大括号 
    { token: ';', pattern: /;/ }, # 分号 
    { token: '=', pattern: /=/ }, # 等号 
    { token: '+', pattern: /\+/ }, # 加号 
    { token: '*', pattern: /\*/ }, # 乘号 
    { token: '<', pattern: /</ }, # 小于号 
    { token: 'n', pattern: /[0-9]+/ }, # 数字 
    { token: 'b', pattern: /true|false/ }, # 布尔值 
    { token: 'v', pattern: /[a-z]+/ } # 变量名
  ]

  def analyze
    [].tap do |tokens|
      while more_tokens?
        tokens.push(next_token)
      end
    end
  end

  def more_tokens?
    !string.empty?
  end

  def match_at_beginning(pattern, string)
    /\A#{pattern}/.match(string)
  end

  def rule_with_longest_match(rules_with_matches) 
    rules_with_matches.max_by { |rule, match| match.to_s.length }
  end

  def string_after(match)
    match.post_match.lstrip
  end

  def rule_matching(string) 
    matches = GRAMMAR.map { |rule| match_at_beginning(rule[:pattern], string) }
    rules_with_matches = GRAMMAR.zip(matches).reject { |rule, match| match.nil? }
    rule_with_longest_match(rules_with_matches)
  end

  def next_token
    rule, match = rule_matching(string)
    self.string = string_after(match)
    rule[:token]
  end
end

LexicalAnalyzer.new('y = x * 7').analyze

LexicalAnalyzer.new('while (x < 5) { x = x * 3 }').analyze

LexicalAnalyzer.new('if (x < 10) { y = true; x = 0 } else { do-nothing }').analyze