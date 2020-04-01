class CommenterController < ApplicationController

  def index
    load_comments
  end

  def create
    load_comments

    @table = params[:table]
    @column = params[:column]
    @comment = params[:comment].strip

    @comments[@table][@column] = @comment

    @progress_percentage = compute_progress_percentage

    File.open(yaml_file, "w") do |file|
      file.write @comments.to_yaml
    end

    respond_to do |format|
      format.json
    end
  end

 private

  def load_comments
    @comments = {}

    tables = ActiveRecord::Base.connection.execute(sql).to_a
    @models = []

    tables.each do |table|
      model_name = table["Name"].singularize.camelize
      model = Object.const_set(model_name, Class.new(ActiveRecord::Base))

      @models << { name: table["Name"], model: model }

      @comments[table["Name"]] = initialize_model_columns(model)
    end

    if File.file?(yaml_file)
      yaml_values = YAML.load(File.read(yaml_file))

      yaml_values.each do |table_group|
        table = table_group[0]
        columns = table_group[1]
        columns.each do |column, value|
          @comments[table][column] = value
        end
      end
    end

    @progress_percentage = compute_progress_percentage

  rescue
    puts "Error:", yaml_values
  end

  def compute_progress_percentage
    field_total = 0
    field_with_comment = 0

    @comments.each do |table, columns|
      columns.each do |column, value|
        next if column =~ /^id$|_id$|created_at|updated_at/

        field_total += 1.0
        field_with_comment += 1.0 unless value == ''
      end
    end

    ((field_with_comment / field_total) * 100).to_i
  end

  def initialize_model_columns(model)
    columns = {}
    (model.columns rescue []).each do |column|
      columns[column.name] = ''
    end
    columns
  end

  def yaml_file
    @yaml_file ||= Rails.root.join('db/comments.yml')
  end

  def sql
    <<-SQL
      SELECT n.nspname as "Schema",
        c.relname as "Name",
        CASE c.relkind WHEN 'r' THEN 'table' WHEN 'v' THEN 'view' WHEN 'm' THEN 'materialized view' WHEN 'i' THEN 'index' WHEN 'S' THEN 'sequence' WHEN 's' THEN 'special' WHEN 'f' THEN 'foreign table' WHEN 'p' THEN 'table' WHEN 'I' THEN 'index' END as "Type",
        pg_catalog.pg_get_userbyid(c.relowner) as "Owner"
      FROM pg_catalog.pg_class c
           LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relkind IN ('r','p','')
            AND n.nspname <> 'pg_catalog'
            AND n.nspname <> 'information_schema'
            AND n.nspname !~ '^pg_toast'
        AND pg_catalog.pg_table_is_visible(c.oid)
      ORDER BY 1,2;
    SQL
  end

end
