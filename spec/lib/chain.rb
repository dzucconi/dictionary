require File.expand_path '../../../spec/spec_helper.rb', __FILE__

describe 'Chain' do
  describe '#color' do
    it 'returns the symbolized environment color' do
      Chain.color.must_equal :red
    end
  end

  describe '#take' do
    it 'returns (up to) n samples from the given environment dictionary' do
      Chain.take.length.must_equal 1
      Chain.take(2).length.must_equal 2
      Chain.take(20).length.must_equal 20
    end
  end
end
