
const image_base = 'https://cdn.jsdelivr.net/gh/eddo888/Expando@master/image/';

const image_closed   = image_base + 'expandoClosed.png';
const image_open     = image_base + 'expandoOpen.png';
const image_property = image_base + 'property.png';
const image_blank    = image_base + 'taskBlank.png';
const image_todo     = image_base + 'taskTodoIncomplete.png';
const image_done     = image_base + 'taskTodoComplete.png';


var example = `
  <div class="table">
    <div class="row">
	  <div class="name">eddo:root</div> <div class="value"/>
	<div/>
	<div class="row"/>
  </div>
`;

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
						$('<span>').text(name)
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

					var new_row = $('<div/>')
						.addClass('expando_column')
						.appendTo(div_row)
					;
					
					var new_img = $('<div/>')
						.addClass('expando_indent')
						.append(
							$('<img/>').attr('src', image_blank)
						)
						.appendTo(new_row)
					;
					
					var div_expando = $('<div/>')
						.addClass('opml')
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
					$(div_expando).expando(child, ignoreFunctions, traveled);
            
				}
			});
        });
    }
});
