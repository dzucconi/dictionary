require 'marky_markov'

CHAIN = MarkyMarkov::Dictionary.new(File.expand_path("../#{ENV['COLOR']}", __FILE__))
