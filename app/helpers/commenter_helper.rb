module CommenterHelper

  def tr_class(column_name)
    return 'hidden-column timestamp' if ['created_at', 'updated_at'].include?(column_name)
    return 'hidden-column id' if column_name == 'id'
    return 'foreign-id' if column_name =~ /_id$/

    ''
  end

  def column_length(column)
    value = column_length_value(column)

    return value if value == ''

    "(#{value})"
  end

  def column_length_value(column)
    return column.limit if column.limit
    return [column.precision, column.scale].join(', ') if column.precision

    ''
  end

  def column_default(column)
    [
      column.null ? "<span class='badge badge-outline-dark'>NULL</span>" : nil,
      column.default ? "<span class='badge badge-info'>#{column.default}</span>" : nil
    ].compact.join(' ').html_safe
  end

  def column_name(name)
    if name =~ /_id$/
      return "<a class='foreign-links' href='#{name.delete_suffix('_id').pluralize}'>#{name}</a>".html_safe
    end

    name
  end

end
