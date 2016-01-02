class Application < Sinatra::Base
  set :assets_precompile, %w(application.css application.js)
  set :assets_prefix, %w(assets)
  set :assets_css_compressor, :sass
  set :protection, except: [:frame_options]

  register Sinatra::AssetPipeline

  get '/' do
    HTML.new.page do
      HTML.new.div(class: 'stage js-stage') {
        Chain.take(params[:n]).map { |x| HTML.new.span { x } }.join('')
      }
    end
  end

  get '/verse' do
    content_type :json, 'charset' => 'utf-8'
    Chain.take(params[:n]).to_json
  end
end
