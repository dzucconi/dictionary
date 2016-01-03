class Chain
  CHAINS = {
    red: 'data.verb',
    blue: 'data.noun',
    black: 'data.adj'
  }

  SOURCE = File.expand_path("../#{CHAINS[ENV['COLOR'].to_sym]}", __FILE__)

  def self.take(n = 1)
    n = n.nil? || n.zero? ? 1 : n
    fragments = File.readlines(SOURCE).sample(n).first.downcase.split(';')
      [[fragments].flatten.sample]
  end
end
