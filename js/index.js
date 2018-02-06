
var xml=`\
<?xml version="1.0" encoding="UTF-8"?>
<eddo:root xmlns:eddo="ns:eddo" attr='val'>
    <child1>text1</child1>
    <!-- you cant see me -->
    <child2>text2<child2>
</eddo:root>
`;

var doc = fromXML(xml);

var json = doc;

var obj = doc;

function reload_expando(){
    if ($('#data-type-json').is(':checked')) {
        $('#source').val(JSON.stringify(json,null,4));
        obj = json;
    } 
    if ($('#data-type-xml').is(':checked'))  {
        $('#source').val(xml);
        obj = doc;
    }
    var checked = $('#ignore-functions-1').is(":checked");
    $('#mygoodies').find('*').remove();
    $('#mygoodies').expando(obj,checked);
    var now = new Date();
    $('#when').text(now.toISOString().replace("T"," ").replace("Z",""));
    $('#checked').text(checked);
}

function reload_source(){
    if ($('#data-type-json').is(':checked')) {
        json = JSON.parse($('#source').val());
    } 
    if ($('#data-type-xml').is(':checked')) {
        xml = $('#source').val();
        doc = fromXML(xml);
    }
    reload_expando();
}

function convert_source(){
    if ($('#data-type-json').is(':checked')) {
        json = JSON.parse($('#source').val());
        xml = toXML(json, null, 4);
        doc = fromXML(xml);
        $('#data-type-xml').click();
    } 
    if ($('#data-type-xml').is(':checked')) {
        xml = $('#source').val();
        doc = fromXML(xml);
        json = doc;
        $('#data-type-json').click();
    }
}

$(document).ready(function() {
    $('input').checkboxradio();
    $('#ignore-functions-1')
        .change(reload_expando);
    
    $('#diagnostics').hide();
    $('#diagnostics-1').change(function(){
        if ($(this).is(':checked')) {
            $('#diagnostics').show();
        } 
        else {
            $('#diagnostics').hide();
        }
    });
    
    $('#data-type-json').change(function(){
        reload_expando();
    });
    $('#data-type-xml').change(function(){
        reload_expando();
    });
    
    $('#source')
        .val(xml)
        .change(reload_source)
        .mouseleave(reload_source)
    ;

    $('#parse').button().click(reload_source);
    
    $('#convert').button().click(convert_source);

    reload_expando();

});

