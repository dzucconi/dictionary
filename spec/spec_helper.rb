ENV['RACK_ENV'] = 'test'

require 'rubygems'
require 'bundler'
require 'minitest/autorun'
require 'rack/test'

Bundler.require

require 'sinatra/asset_pipeline'
require 'byebug'

%w(
  /../config/initializers/**/*.rb
  /../lib/**/*.rb
)
  .map { |pattern| Dir[File.dirname(__FILE__) + pattern] }
  .flatten
  .each { |f| require f }

require './application'
