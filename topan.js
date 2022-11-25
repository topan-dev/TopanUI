// ======================= Markdown =======================

var Markdown={
    markdown_content: "",
    contents: "",
    contentstotal: 0,
    copy: function(text){
        const text_area=document.createElement('textarea');
        document.body.appendChild(text_area);
        text_area.setAttribute('id','markdown-copier');
        document.getElementById('markdown-copier').value=text;
        text_area.select();
        document.execCommand('copy');
        document.body.removeChild(text_area);
    },
    newrandomid: function(){
        var chars="0123456789abcdef",result="";
        for(var i=0;i<64;i++)
            result=result+chars[parseInt(Math.random()*16)];
        return result;
    },
    easy_markdown: function(str){
        // 处理粗体、斜体、行内代码块
        var result="";
        var instrong=false,inem=false,ininlinecode=false,inmathjax=false;
        for(var i=0;i<str.length;i++){
            if(str.charAt(i)=='$'){
                result=result+str.charAt(i);
                inmathjax=!inmathjax;
            }
            else if(str.charAt(i)=='*'&&!inmathjax&&!ininlinecode){
                var total=1;
                while(str.charAt(i+1)=='*')i++,total++;
                if(total==1){
                    if(inem)result=result+"</em>";
                    else result=result+"<em>";
                    inem=!inem;
                }
                if(total==2){
                    if(instrong)result=result+"</strong>";
                    else result=result+"<strong>";
                    instrong=!instrong;
                }
                if(total==3){
                    if(inem){
                        if(instrong)result=result+"</em></strong>";
                        else result=result+"</em><strong>";
                    }
                    else{
                        if(instrong)result=result+"</strong><em>";
                        else result=result+"<strong><em>";
                    }
                    inem=!inem;
                    instrong=!instrong;
                }
            }
            else if(str.charAt(i)=='`'&&!inmathjax){
                if(ininlinecode)result=result+"</span>";
                else result=result+"<span style='font-family: \"font-codetext\";'>";
                ininlinecode=!ininlinecode;
            }
            else result=result+str.charAt(i);
        }
        return result;
    },
    line_markdown: function(line){
        if(line[0]=='<')return line;
        if(line[0]=='$'&&line[1]=='$'){
            return '<p>'+line+'</p>';
        }
        if(line[0]=='!'&&line[1]=='['){
            var i=2,imgname="",imgurl="";
            while(line[i]!=']')imgname=imgname+line[i],i++;
            i+=2;
            while(line[i]!=')')imgurl=imgurl+line[i],i++;
            return '<img src="'+imgurl+'" alt="'+imgname+'">';
        }
        if(line=="---")return `<hr>`;
        if(line[0]=='#'){
            var i=0,txt="",grd,Id=Markdown.newrandomid();
            while(line[i]=='#')i++;
            grd=i;
            for(i++;i<line.length;i++)
                txt=txt+line[i];
            contents.push({id:Id,grade:grd,text:txt});
            contentstotal++;
            return '<h'+grd+' id="title-'+Id+'">'+Markdown.easy_markdown(txt)+'</h'+grd+'>';
        }
        return '<p>'+Markdown.easy_markdown(line)+'</p>';
    },
    writecontent: function(contents,contentstotal){
        // 导出目录
        markdown_content="";
        var mintitle=6;
        for(var i=0;i<contentstotal;i++)
            if(contents[i].grade<mintitle)mintitle=contents[i].grade;
        for(var i=0;i<contentstotal;i++){
            if(contents[i].grade<=2)markdown_content=markdown_content+
                `<p onclick="document.getElementById('title-`+contents[i].id+`').scrollIntoView(true);" class="markdown-content-large">`;
            else markdown_content=markdown_content+
                `<p onclick="document.getElementById('title-`+contents[i].id+`').scrollIntoView(true);" class="markdown-content-small">`;
            for(var j=1;j<=contents[i].grade-mintitle;j++)
                markdown_content=markdown_content+'&nbsp;&nbsp;&nbsp;&nbsp;';
            markdown_content=markdown_content+contents[i].text+"</p>";
        }
    },
    block_markdown: function(md){
        var lines=md.split("\n\n");
        var res="";
        for(var i=0;i<lines.length;i++)
            res=res+Markdown.line_markdown(lines[i]);
        return res;
    },
    sys: function(file){
        contents=new Array(),contentstotal=0;
        var tmp=file.split("\r");
        file="";
        for(var i=0;i<tmp.length;i++)
            file=file+tmp[i];
        var codes=file.split("\n```");
        var res="";
        for(var i=0;i<codes.length;i++){
            var codebarid=Markdown.newrandomid();
            if(i%2==0)
                res=res+Markdown.block_markdown(codes[i]);
            else{
                var lang="",tmp="",j=0;
                while(codes[i][j]!='\n')lang=lang+codes[i][j],j++;
                for(j++;j<codes[i].length;j++)
                    tmp=tmp+codes[i][j];
                res=res+`
    <div class="markdown-code-divoutside">
        <button class="markdown-code-copybutton" onclick="markdown.copy(document.getElementById(\'code-`+codebarid+`\').innerText);">
            <i class="fa fa-regular fa-copy"></i>
        </button>
        <div class="markdown-code-divinside">
            <pre class="markdown-code-pre" id="code-`+codebarid+`">`+hljs.highlight(tmp,{language:lang}).value+`</pre>
        </div>
    </div>`;
            }
        }
        Markdown.writecontent(contents,contentstotal);
        return res;
    }
};

// ======================= Topan System =======================

function topan_init_all(){
    topan_init_tabs();
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