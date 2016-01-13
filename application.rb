class Application < Sinatra::Base
  set :assets_precompile, %w(application.css application.js)
  set :assets_prefix, %w(assets)
  set :assets_css_compressor, :sass
  set :protection, except: [:frame_options]

  register Sinatra::AssetPipeline

  get '/' do
    HTML.new.instance_eval do
      page do
        audio(class: 'js-audio') do
          source(type: 'audio/wav', class: 'js-source')
        end +

        div(class: 'stage js-stage') do
          Chain.take(20).map { |x| span { x } }.join('')
        end
      end
    end
  end

  get '/verse' do
    content_type :json, 'charset' => 'utf-8'
    Chain.take(params[:n]).to_json
  end
end
