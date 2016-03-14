class Chain
  CHAINS = {
    red: :verb,
    blue: :noun,
    black: :adj,
    pink: :adv
  }

  DOMAINS = {
    'dictionary.red' => :red,
    'dictionary.blue' => :blue,
    'dictionary.black' => :black,
    'dictionary.pink' => :pink
  }

  class << self
    def source
      File.expand_path("../chain/data.#{CHAINS[color]}", __FILE__)
    end

    def color
      Config.get :color
    end

    def take(n = 1)
      n = n.nil? || n.zero? ? 1 : n

      lines = File.readlines(source).sample(n).map { |line|
        line.downcase.split(';').sample
      }
        .flatten
        .map { |x| RubyPants.new(x.strip).to_html }
        .take(n)
    end

  end
end
