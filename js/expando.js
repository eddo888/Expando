const image_base = 'https://cdn.jsdelivr.net/gh/eddo888/Expando@master/image/';

const image_closed   = image_base + 'expandoClosed.png';
const image_open     = image_base + 'expandoOpen.png';
const image_property = image_base + 'property.png';
const image_dot      = image_base + 'task0.png';
const image_todo     = image_base + 'taskTodoIncomplete.png';
const image_done     = image_base + 'taskTodoComplete.png';

$.fn.extend({
    expando: function(node, ignoreFunctions, traveled) {
        if (!traveled) traveled = [];
        if (_.contains(traveled,node)) return;
        traveled.push(node);
      
        if (!_.isObject(node)) { // is a value
            return $(this).append(
				$('<td>')
					.addClass('expando_td')
					.append(
						$('<div/>')
							.addClass('expando_container')
			          		.append(
					  	  		$('<textarea>')
			                  	 	.addClass('expando_value')
			          	  	  		.val(node)
			          		)
					)
				
			);
        }
      
        return $(this).each(function() {
            var table = $('<table/>')
				.addClass('expando_table')
				.appendTo($(this))
			;
            
            $.each(node,function(name, child) {
                if (ignoreFunctions && _.isFunction(child)) {
                    return;
                }
                var tr = $('<tr/>')
					.addClass('expando_tr')
                    .appendTo(table)
                ;
                
                var td = $('<td/>')
					.attr('valign','top')
					.appendTo(tr)
				;

                var img;
                if (_.isObject(child)) {
                    img = $('<img/>')
                    	.attr('src',image_closed)
                    	.appendTo(td)
                    ;
                }
                else {
                    img = $('<img/>')
                    	.attr('src', image_todo)
                    	.appendTo(td)
                    ;
                }

                var td = $('<td/>')
					.appendTo(tr)
				;

				var container = $('<div/>')
					.addClass('expando_container')
					.appendTo(td)
				;
					
                var a = $('<div/>')
					.addClass('expando_name')
					.append(
                		$('<span>').text(name)
               	 	).appendTo(container)
				;
                
                if (! _.isObject(child)) {
                    $('<span/>').val(': ').appendTo(td);
                    $('<textarea/>')
						.addClass('expando_value')
						.val(child)
						.appendTo(container)
					;
                }
                
                if (_.isArray(child)) {
                    $('<span/>')
						.text('['+child.length+']')
						.appendTo(container)
					;
                }
                
                if (_.isFunction(child)) {
                    $('<span/>')
						.text('()')
						.appendTo(container)
					;
                }
                
                var lower = $('<tr/>')
					.addClass('expando_tr')
					.appendTo(table)
				;
                $('<td/>')
					.appendTo(lower)
				;
                
                var div = $('<div/>')
                    .addClass('opml')
					.addClass('expando_container')
					.appendTo(
						$('<td/>')
							.addClass('expando_td')
							.attr('valign','bottom')
							.appendTo(lower)
					)
				;

                // start closed
                $(div).hide();

                $(img).click(function() {
                	if ($(div).find('tr').length > 1) {
	                    $(div).toggle();
	                    if ($(div).is(':visible')) {
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
                
                if (_.isObject(child)) {
                    $(div).expando(child, ignoreFunctions, traveled);
                }
                
            });
            
        });
    }
});
