class HTML
  include Sprockets::Helpers

  def method_missing(type, attributes = {})
    tag type, attributes, block_given? ? yield.to_s : nil
  end

  def tag(type, attributes, content)
    attributes.map { |k, v|
      "#{k}='#{v}'"
    }.join(' ').let { |attrs|
      " #{attrs}" unless attrs.empty?
    }.let { |attrs|
      content.nil? ? "<#{type}#{attrs}>" : "<#{type}#{attrs}>#{content}</#{type}>"
    }
  end

  def page
    '<!doctype html>' +
    html('data-color': ENV['COLOR'], 'data-direction': ENV['DIRECTION'], 'data-speed': ENV['SPEED']) {
      head {
        meta(charset: 'utf-8') +
        meta('http-equiv' => 'X-UA-Compatible', content: 'IE=edge,chrome=1') +
        meta(name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=0') +
        meta(name: 'apple-mobile-web-app-capable', content: 'yes') +
        meta(name: 'apple-mobile-web-app-status-bar-style', content: 'black') +

        title { "dictionary.#{ENV['COLOR']}" } +

        link(rel: 'apple-touch-icon', href: image_path("#{ENV['COLOR']}.png")) +
        link(rel: 'icon', href: image_path("#{ENV['COLOR']}.ico")) +
        link(rel: 'stylesheet', type: 'text/css', href: stylesheet_path('application'))
      } +
      body {
        yield +

        script(src: javascript_path('application'), type: 'text/javascript') {} +
        Analytics.new.tag(ENV['TRACKING_ID'])
      }
    }
  end
end
