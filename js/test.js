async function GenerateOneRow(format, person, location, options, i) {
  let row = [];
  for (let format_index = 0; format_index < format.length; format_index++) {
    let column;
    if (format[format_index].data_type != "array") {
      column = {
        [format[format_index].name]: await generateData(
          format[format_index],
          options.rows,
          i,
          await person,
          await location
        ),
      };
    } else {
      column = {
        [format[format_index].name]: await GenerateOneRow(
          format[format_index].array,
          person,
          location,
          options,
          i
        ),
      };
    }

    row.push(column);
  }
  return row;
}
