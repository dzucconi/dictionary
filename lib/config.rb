class Config
  @@config = {}

  def self.set(name, value)
    @@config[name.to_sym] = value&.to_sym
  end

  def self.get(name)
    @@config[name]
  end

  def self.to_json
    @@config.to_json
  end

  def self.to_hash
    @@config
  end
end
