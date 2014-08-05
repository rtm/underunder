__.unicode={
    fw      : {
        //full-width forms
        convert    : {
            HAN_TO_ZEN : 0xfee0,
            HAN_START  : 0x21,
            HAN_END    : 0x7f,
            ZEN_START  : 0xfee0 + 0x21,
            ZEN_END    : 0xfee0 + 0x7f,
            convert    : function(start,end,adjust,z){
                //function which offsets code points in a string in a given range
                return String.fromCharCode.apply(
					0,
					__.string.toCharCode(String(z)).map(function(c){return c>=start&&c<=end?c+adjust:c;})
				);
            },
            from       : function(z){
				return this.convert(this.ZEN_START, this.ZEN_END, -this.HAN_TO_ZEN, z);
			},
            to         : function(z){
				return this.convert(this.HAN_START, this.HAN_END,  this.HAN_TO_ZEN, z);
			}
		},
        re         : {
            //__.unicode.fw.re.katakana, etc.
            katakana     : "[\u30a0-\u30ff]",
            not_katakana : "[^\u30a0-\u30ff]",
            digit        : "[０-９]",
            upper        : "[Ａ-Ｚ]",
            lower        : "[ａ-ｚ]"
        },
        equals     : function(a,b){return a && b && (a===b || this.convert.from(a)===this.convert.from(b));},
        groups     : {
            katakana_marks : [//without dakuten
                "\u30a2","\u30a4","\u30a6","\u30a8","\u30aa",//aieuo
                "\u30ab","\u30ad","\u30af","\u30b1","\u30b3",//kakikukeko
                "\u30b5","\u30b7","\u30b9","\u30bb","\u30bd",//sasisuseso
                "\u30bf","\u30c1","\u30c4","\u30c6","\u30c8",//tatituteto
                "\u30ca","\u30cb","\u30cc","\u30cd","\u30ce",//naninuneno
                "\u30cf","\u30d2","\u30d5","\u30d8","\u30db",//hahiheheho
                "\u30de","\u30df","\u30e0","\u30e1","\u30e2",//mamimumemo
                "\u30e4","\u30e6","\u30e8",//yayuyo
                "\u30e9","\u30ea","\u30eb","\u30ec","\u30ed",//rarirureru
                "\u30ef",//wa
                "\u30f3"//n
            ]
        }
    },
    shapes  : {
        "■" : {c: "b", n: "square"},
        "□" : {c: "w", n: "square"},
        "▲" : {c: "b", n: "triangle_up"},
        "△" : {c: "w", n: "triangle_up"},
        "▼" : {c: "b", n: "triangle_down"},
        "▽" : {c: "w", n: "triangle_down"},
        "◆" : {c: "b", n: "diamond"},
        "◇" : {c: "w", n: "diamond"},
        "●" : {c: "b", n: "circle"},
        "○" : {c: "w", n: "circle"},
//        "✖" : {c: "b", n: "cross"},
        "✖" : {c: "w", n: "cross"},
        "▴" : {c: "b", n: "small_triangle_up"},
        "▵" : {c: "w", n: "small_triangle_up"},
        "▾" : {c: "b", n: "small_triangle_down"},
        "▿" : {c: "w", n: "small_triangle_down"}
    },
    classes : {
        commas        : [",","\uff0c","\uff64","\u3001"],
        dashes        : ["-","--","\u2010","\u2012","\u2013","\u2014","\u2015","\u2053","\u2212","\uff0c","\uff0d","‑"/*non-breaking hyphen*/],
        single_quotes : ["'","\u2019","\u2018"],
        double_quotes : ['"',"\u201c","\u201d","\u2033"]
    }
};
