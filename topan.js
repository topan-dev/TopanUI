// ======================= Topan System =======================

var TopanSystem={
    loadfile: function(url,func){
        $.ajax({
            url: url,
            success: func
        });
    }
}

function topan_init_all(){
    topan_init_tabs();
    topan_init_codes();
}
$(document).ready(function(){
    topan_init_all();
});

function topan_init_tabs(){
    $(".topan-tab li").click(function(){
        if(!$(this).hasClass(".topan-tab-showed")){
            $(this.parentElement).children(".topan-tab-showed").removeClass("topan-tab-showed");
            $(this).addClass("topan-tab-showed");
            $(this.parentElement.parentElement).children(".topan-tab-showed").removeClass("topan-tab-showed");
            $(this.parentElement.parentElement.children.item($(this).index()+1)).addClass("topan-tab-showed");
        }
    });
}

function topan_init_codes(){
    var prelist=$("pre");
    prelist.each(function(){
        let button=$("<span class='button-copy button-copy-status btn'></span>");
        button.attr("onclick","copy(this);");
        button.prependTo($(this));
    });
}

var copy=(obj)=>{
    navigator.clipboard.writeText($(obj).parent().text())
        .then(()=>{
            $(obj).text('复制成功！');
            $(obj).addClass('button-copy-success');
            $(obj).removeClass('button-copy-status');
            setTimeout(()=>{
                $(obj).removeClass('button-copy-success');
                $(obj).addClass('button-copy-status');
                $(obj).text('');
            },1000);
        })
        .catch(err=>{
            $(obj).text('复制失败。');
            console.log(err);
            $(obj).addClass('button-copy-fail');
            $(obj).removeClass('button-copy-status');
            setTimeout(()=>{
                $(obj).removeClass('button-copy-fail');
                $(obj).addClass('button-copy-status');
                $(obj).text('');
            },1000);
        });
}