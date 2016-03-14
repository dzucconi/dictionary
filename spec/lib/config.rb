require File.expand_path '../../../spec/spec_helper.rb', __FILE__

describe 'Config' do
  describe '#set, #get' do
    it 'sets and gets' do
      Config.set :color, :red
      Config.get(:color).must_equal :red
    end
  end
end
