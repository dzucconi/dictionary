class Chain
  CHAINS = {
    red: 'data.verb',
    blue: 'data.noun',
    black: 'data.adj'
  }

  SOURCE = File.expand_path("../chain/#{CHAINS[ENV['COLOR'].to_sym]}", __FILE__)

  def self.color
    ENV['COLOR'].to_sym
  end

  def self.take(n = 1)
    n = n.nil? || n.zero? ? 1 : n
    lines = File.readlines(SOURCE).sample(n).map { |line|
      line.downcase.split(';')
    }.flatten.map(&:strip).take(n)
  end
end