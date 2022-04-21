const image_closed = 'https://cdn.jsdelivr.net/gh/eddo888/Expando@master/image/expandoClosed.png';
const image_open = 'https://cdn.jsdelivr.net/gh/eddo888/Expando@master/image/expandoOpen.png';
const image_property = 'https://cdn.jsdelivr.net/gh/eddo888/Expando@master/image/property.png';
const image_dot = 'https://cdn.jsdelivr.net/gh/eddo888/Expando@master/image/task0.png';
const image_todo = 'https://cdn.jsdelivr.net/gh/eddo888/Expando@master/image/taskTodoIncomplete.png';
const image_done = 'https://cdn.jsdelivr.net/gh/eddo888/Expando@master/image/taskTodoComplete.png';

$.fn.extend({
    expando: function(node, ignoreFunctions, traveled) {
        if (!traveled) traveled = [];
        if (_.contains(traveled,node)) return;
        traveled.push(node);
      
        if (!_.isObject(node)) {
          return $(this).append(
            $('<table>')
              .append(
                $('<tr>')
                  .append(
                    $('<td>')
                      .append($('<input>')
                      .addClass('property_value')
                      .val(node)
                      )
                  )
              )
          );
        }
      
        return $(this).each(function() {
            var table = $('<table/>').appendTo($(this));
            
            $.each(node,function(name, child) {
                if (ignoreFunctions && _.isFunction(child)) {
                    return;
                }
                var tr = $('<tr/>')
                    .appendTo(table)
                ;
                
                var td = $('<td/>').attr('valign','top').appendTo(tr);

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

                var td = $('<td/>').appendTo(tr);

                var a = $('<span/>').addClass('property_name').append(
                	$('<span>').text(name)
                ).appendTo(td);
                
                if (! _.isObject(child)) {
                    $('<span/>').val(': ').appendTo(td);
                    $('<input/>').addClass('property_value').val(child).appendTo(td);
                }
                
                if (_.isArray(child)) {
                    $('<span/>').text('['+child.length+']').appendTo(td);
                }
                
                if (_.isFunction(child)) {
                    $('<span/>').text('()').appendTo(td);
                }
                
                tr = $('<tr/>').appendTo(table);
                $('<td/>').appendTo(tr);
                
                var div = $('<div/>')
                    .addClass('opml').appendTo($('<td/>').attr('valign','bottom').appendTo(tr));

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
