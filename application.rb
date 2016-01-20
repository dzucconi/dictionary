class Application < Sinatra::Base
  set :assets_precompile, %w(application.css application.js *.ico *png *.svg *.woff *.woff2)
  set :assets_prefix, %w(assets)
  set :assets_css_compressor, :sass
  set :protection, except: [:frame_options]

  register Sinatra::AssetPipeline

  get '/' do
    lines = Chain.take 20

    HTML.new.instance_eval do
      page do
        noscript do
          div(class: 'stage js-stage', 'data-state': 'running') do
            a(href: '/') { lines.first }
          end
        end +

        div(class: 'stage js-stage') {} +

        script do
          "window.__QUEUE__ = #{lines.to_json}"
        end
      end
    end
  end

  get '/verse' do
    content_type :json, 'charset' => 'utf-8'
    Chain.take(params[:n].to_i).to_json
  end

  get '/robots.txt', provides: :txt do
    ['User-agent: *', 'Disallow:'].join("\n")
  end
end
