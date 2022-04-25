var xml=`\
<?xml version="1.0" encoding="UTF-8"?>
<eddo:root xmlns:eddo="ns:eddo &amp; and" attr="val ' <">
    <child1>text " &gt;</child1>
    <!-- you cant see me -->
    <child2>
        <grandchild>one ' &lt;</grandchild>
        <grandchild>two " &gt;</grandchild>
    </child2>
</eddo:root>
`;

var obj = null;

function reload(){
	var igfun = $('#igfunchk').is(":checked");
	$('#mygoodies').find('*').remove();
	$('#mygoodies').expando(obj,igfun);
	var now = new Date();
	$('#when').text(now.toISOString().replace("T"," ").replace("Z",""));
	$('#igfun').text(igfun);
}

function parse(){
	if ($('#is-json').is(':checked')) {
		obj = JSON.parse($('#source').val());
	} 
	if ($('#is-xml').is(':checked')) {
		obj = fromXML($('#source').val());
	}
	console.log('parsed', obj);
	reload();
}

function unparse(){
	var goodies = $('#mygoodies').collapso();
	console.log('unparsed',goodies);
	if ($('#is-json').is(':checked')) {
		$('#source').val(JSON.stringify(goodies,null,4));
	} 
	if ($('#is-xml').is(':checked')) {
		$('#source').val(toXML(goodies,null,4));
	}
}

$(document).ready(function() {

	$('input').checkboxradio();
	
	$('#igfunchk').change(reload);
	
	$('#diagnostics').hide();
	$('#diagchk').change(function(){
		if ($(this).is(':checked')) {
			$('#diagnostics').show();
		} 
		else {
			$('#diagnostics').hide();
		}
	});

	$('#parse').button().click(parse);
	$('#unparse').button().click(unparse);
	
	$('#source').val(xml);
	parse();
	
	$('#is-json').change(unparse);
	$('#is-xml').change(unparse);

});

