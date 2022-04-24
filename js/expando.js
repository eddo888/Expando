const image_base = 'https://cdn.jsdelivr.net/gh/eddo888/Expando@master/image/';

const image_closed   = image_base + 'expandoClosed.png';
const image_open     = image_base + 'expandoOpen.png';
const image_property = image_base + 'property.png';
const image_dot      = image_base + 'task0.png';
const image_todo     = image_base + 'taskTodoIncomplete.png';
const image_done     = image_base + 'taskTodoComplete.png';


var example = `
  <div class="expando_table">
    <div class="expando_row">
	  <div class="expando_name"/>    <div class="expando_value"/>
	<div/>
	<div class="expando_row"/>
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
					.addClass('expando_column')
					.append(
						$('<textarea>')
    	      	 			.addClass('expando_value')
  	  		  				.val(node)
				)
			);
        }
	    else {	
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
	                
	                var div_image = $('<div/>')
						.addClass('expando_indent')
						.attr('valign','top')
						.appendTo(div_row)
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
						.addClass('expando_column')
						.addClass('expando_name')
						.appendTo(div_row)
					;
	
					var div_value = $('<div/>')
						.addClass('expando_column')
						.addClass('expando_value')
						.appendTo(div_row)
					;
						
					$('<span>').text(name)
	               	 	.appendTo(div_name)
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
	               
					// this is the indentation
	                $('<div/>')
						.addClass('expando_indent')
						.appendTo(div_value)
					;
					
	                var div_expando = $('<div/>')
	                    .addClass('opml')
						.appendTo(div_value)
					;
	
	                // start closed
	                $(div_expando).show(); //.hide();
	
	                $(img).click(function() {
	                	if ($(div_expando).find('div').length > 1) {
		                    $(div_expando).toggle();
		                    if ($(div_expando).is(':visible')) {
		                        $(img).attr('src', image_open)
		                    }
		                    else {
		                        $(img).attr('src', image_closed)
		                    }
	                    }
	                    else {
	                    	if ($(img).attr('src') == image_done) {
		                        $(img).attr('src', image_todo)
		                    }
		                    else {
		                        $(img).attr('src', image_done)
		                    }
	                    }
	                });
	                
					var div_child = $('<div/>')
						.addClass('expando_table')
						.appendTo(div_row)
					;

					// recurse
					$(div_child).expando(child, ignoreFunctions, traveled);
	                
	            });
	            
	        });
		}
    }
});
