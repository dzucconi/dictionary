class Application < Sinatra::Base
  set :assets_precompile, %w(application.css application.js)
  set :assets_prefix, %w(assets)
  set :assets_css_compressor, :sass
  set :protection, except: [:frame_options]

  register Sinatra::AssetPipeline

  helpers do
    def verse(n = 1)
      n = n.to_i
      n = 1 if n.zero?
      fragments = CHAIN.generate_n_sentences(n).downcase.split(/,|;/)
      [fragments].flatten.map { |fragment|
        fragment.strip.gsub(/\W$/, '')
      }
    end
  end

  get '/' do
    HTML.new.page do
      HTML.new.div(class: 'stage js-stage') {
        verse(params[:n]).map { |x| HTML.new.span { x } }.join('')
      }
    end
  end

  get '/verse' do
    content_type :json, 'charset' => 'utf-8'
    verse(params[:n]).to_json
  end
end
