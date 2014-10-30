(function ($) {
    var root = this;

    var Editor = function (grid) {
        this.grid = grid;
    };
    Editor.extend = function (props) {
        var parent = this;
        var child;

        child = function () {
            return parent.apply(this, arguments);
        };

        var Surrogate = function () {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();

        if (props) {
            _.extend(child.prototype, props);
        }

        child.__super__ = parent.prototype;

        return child;
    };
    Editor.prototype.getElement = function () {
        return $(this.editor);
    };
    Editor.prototype.initialize = function () {
    };
    Editor.prototype.render = function () {
    };
    Editor.prototype.show = function () {
        this.getElement().show();
    };
    Editor.prototype.hide = function () {
        this.getElement().hide();
        this.grid.activeEditor.activeCell = null;
        this.grid.activeEditor = null;
    };
    Editor.prototype.setDimensions = function ($td) {
        this.getElement().css({width: $td.outerWidth() + 1, height: $td.outerHeight() + 1});
    };
    Editor.prototype.getValue = function () {
        throw Error("Editor.getValue not implemented");
    };
    Editor.prototype.setValue = function () {
        throw Error("Editor.setValue not implemented");
    };

    // export editor
    root.Editor = Editor;

    root.BasicEditor = Editor.extend({
        types: [],
        name: "BasicEditor",
        render: function () {
            if (!this.editor) {
                this.editor = document.createElement("div");
                this.editor.className = "sensei-grid-editor sensei-grid-basic-editor";
                var input = document.createElement("input");
                input.setAttribute("type", "text");
                this.editor.appendChild(input);
                this.grid.$el.append(this.editor);
            }
        },
        getValue: function () {
            return $("input", this.editor).val();
        },
        setValue: function (val) {
            $("input", this.editor).val(val).focus();
        }
    });

    root.TextareaEditor = Editor.extend({
        types: [],
        name: "TextareaEditor",
        render: function () {
            if (!this.editor) {
                this.editor = document.createElement("div");
                this.editor.className = "sensei-grid-editor sensei-grid-textarea-editor";
                var textarea = document.createElement("textarea");
                this.editor.appendChild(textarea);
                this.grid.$el.append(this.editor);
            }
        },
        setDimensions: function ($td) {
            this.getElement().find("textarea").css({width: $td.outerWidth() + 50, height: $td.outerHeight() + 50});
        },
        getValue: function () {
            return $("textarea", this.editor).val();
        },
        setValue: function (val) {
            $("textarea", this.editor).val(val).focus();
        }
    });

    root.BooleanEditor = Editor.extend({
        types: [],
        name: "BooleanEditor",
        render: function () {
            if (!this.editor) {
                this.editor = document.createElement("div");
                this.editor.className = "sensei-grid-editor sensei-grid-boolean-editor";
                var $wrapper = $("<div>", {class: "sensei-grid-checkbox-wrapper"});
                $wrapper.append($("<input>", {type: "checkbox"}));
                $(this.editor).append($wrapper);
                this.grid.$el.append(this.editor);
            }
        },
        setDimensions: function ($td) {
            var css = {
                width: $td.outerWidth() - 3, 
                height: $td.outerHeight() - 3, 
                background: "white"
            };
            this.getElement().find(".sensei-grid-checkbox-wrapper").css(css);
        },
        getValue: function () {
            return $("input", this.editor).is(":checked") ? "true" : "false";
        },
        setValue: function (val) {
            if (val.toLowerCase() === "true") {
                $("input", this.editor).prop("checked", true);
            } else {
                $("input", this.editor).prop("checked", false);
            }
            $("input", this.editor).focus();
        }
    });

    root.SelectEditor = Editor.extend({
        types: [],
        name: "SelectEditor",
        render: function () {
            console.log("CustomEditor.render");

            if (!this.editor) {
                this.editor = document.createElement("div");
                this.editor.className = "sensei-grid-editor sensei-grid-custom-editor";
                var select = document.createElement("select");
                this.editor.appendChild(select);
                this.grid.$el.append(this.editor);
            }
        },
        renderValues: function () {
            if (_.has(this.props, "values")) {
                
                var $select = this.getElement().find("select");
                $select.html(null);

                _.each(this.props["values"], function (val) {
                    var option = document.createElement("option");
                    option.value = val;
                    option.innerHTML = val;
                    $select.append(option);
                });   
            }
        },
        show: function () {
            this.renderValues();
            this.getElement().show();
        },
        getValue: function () {
            return $("select", this.editor).val();
        },
        setValue: function (val) {
            console.log("Set selectbox value", val, $("select>option"));
            $("select>option", this.editor).filter(function () {
                return $(this).val() === val;
            }).attr("selected", "selected");
            $("select").focus();
        }
    });
})(jQuery);