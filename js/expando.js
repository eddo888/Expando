
const image_base = 'https://cdn.jsdelivr.net/gh/eddo888/Expando@master/image/';
//const image_base = 'image/';

const image_closed   = image_base + 'expandoClosed.png';
const image_open     = image_base + 'expandoOpen.png';
const image_property = image_base + 'property.png';
const image_blank    = image_base + 'blank.png';
const image_todo     = image_base + 'taskTodoIncomplete.png';
const image_done     = image_base + 'taskTodoComplete.png';

var is_array = new RegExp('^([^\[]*)\[[0-9]*\]$');

$.fn.extend({
    expando: function(node, ignoreFunctions, traveled) {
        if (!traveled) traveled = [];
        if (_.contains(traveled,node)) return;
        traveled.push(node);
      
		// is a normal value
        if (!_.isObject(node)) {
            return $(this).append(
				$('<div/>')
					.append(
						$('<textarea>')
    	      	 			.addClass('expando_value')
  	  		  				.val(node)
				)
			);
        }

		// iterate all passed elements
        return $(this).each(function() {

            var div_table = $('<div/>')
				.addClass('expando_table')
				.appendTo($(this))
			;
            
            $.each(node,function(name, child) {
                if (ignoreFunctions && _.isFunction(child)) {
                    return;
                }
				
                var div_row = $('<div/>')
					.addClass('expando_row')
					.appendTo(div_table)
                ;
                
				var div_col = $('<div/>')
					.addClass('expando_column')
					.appendTo(div_row)
				;

                var div_image = $('<div/>')
					.addClass('expando_indent')
					.attr('valign','top')
					.appendTo(div_col)
				;
				
                var img;
				
                if (_.isObject(child)) {
                    img = $('<img/>')
                    	.attr('src', image_open)
                    	.appendTo(div_image)
                    ;
                }
                else {
                    img = $('<img/>')
                    	.attr('src', image_todo)
                    	.appendTo(div_image)
                    ;
                }
				
                var div_name = $('<div/>')
					.addClass('expando_name')
					.append(
						$('<span/>').text(name)
					)
					.appendTo(div_col)
				;

                if (_.isArray(child)) {
                    $('<span/>')
						.text('['+child.length+']')
						.appendTo(div_name)
					; 
                }
                
                if (_.isFunction(child)) {
                    $('<span/>')
						.text('()')
						.appendTo(div_name)
					;
                }

				var div_value = $('<div/>')
					.addClass('expando_value')
					.appendTo(div_col)
				;

				if (!_.isObject(child)) {
					$('<input/>')
						.addClass('expando_value')
						.val(child)
 	  		  			.appendTo(div_value)
					;
					
					$(img).click(function() {
						var src = $(div_image).find('img').attr('src');
                		if (src == image_todo) {
							$(img).attr('src', image_done)
						}
						else {
							$(img).attr('src', image_todo)
						}
					});

				}
				else {
					// force a new line
					$('<br/>').appendTo(div_value);

					var div_expando = $('<div/>')
						.addClass('expando_value')
						.addClass('opml')
						.appendTo(div_row)
					;

					var new_row = $('<div/>')
						.addClass('expando_column')
						.appendTo(div_expando)
					;
					
					var new_img = $('<div/>')
						.addClass('expando_indent')
						.append(
							$('<img/>').attr('src', image_blank)
						)
						.appendTo(new_row)
					;
					
					
					// start closed
					$(div_expando).show(); //.hide();
					
					$(img).click(function() {
						var src = $(div_image).find('img').attr('src');
                		if (src == image_open || src == image_closed) {
							$(div_expando).toggle();
							if ($(div_expando).is(':visible')) {
								$(img).attr('src', image_open)
							}
							else {
								$(img).attr('src', image_closed)
							}
						}
					});

					// recurse
					$(new_row).expando(child, ignoreFunctions, traveled);
            
				}
			});
        });
    },
	collapso: function(tipe) {
		var dict = tipe || {};
		
		$(this).each(function(i1, child) {
			//console.log(i1, child);
			
			$(child).children('div.expando_table').each(function(i2, table) {
				//console.log(i2, table);
				
				$(table).children('div.expando_row').each(function(i3, row) {
					//console.log(i3, row);

					var previous = null;
					var tipe = {};
					
					$(row).children('div.expando_column').each(function(i4, col) {
						//console.log(i4, col);
						
						var name = $(col).children('div.expando_name').children('span').text();
						var value = $(col).children('div.expando_value').children('input').val();

						if (name && name.length > 0) {
							previous = name;

							var match = name.match(is_array);
							if (match) {
								//console.log(match);
								previous = match[1];
								tipe = [];
								return;
							}
							
							if (value && value.length > 0) {
								console.log(name, ':', value);
								dict[name] = value
							}
							return;
						}
					});

					$(row).children('div.opml').each(function(i4, opml) {
						//console.log(i4, opml);
						
						$(opml).children('div.expando_column').each(function(i5, col) {
							//console.log(i5, col);

							var d = $(col).collapso(tipe);
							console.log(previous, d);
							dict[previous] = d;
						});
					});
				});
			});
		});
		
		return dict;
	}
});
