##############################################################
##                    COPYRIGHT NOTICE
##
## Copyright (C) 2009-2013. ViniSketch  (c) All rights reserved
##
##############################################################

###                     Declaration 
##############################################################

SHELL = /bin/sh
CHMOD = chmod
CP = cp
XTEMP = ../lib/manage_template.sh 
MV = mv
NOOP = $(SHELL) -c true
RM_F = rm -f
RM_RF = rm -rf
TEST_F = test -f
TOUCH = touch
UMASK_NULL = umask 0
DEV_NULL = > /dev/null 2>&1
MKPATH = mkdir -p
CAT = cat
MAKE = make
OPEN = open
ECHO = echo
ECHO_N = echo -n
JAVA = java
COMPILE = $(JAVA) -jar tools/closurecompiler/compiler.jar --language_in=ECMASCRIPT5
COMPILE_ADV = $(JAVA) -jar tools/closurecompiler/compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS
COMPILE_YUI = $(JAVA) -cp tools/yuicompressor/jargs-1.0.jar:tools/yuicompressor/rhino-1.6R7.jar -jar tools/yuicompressor/yuicompressor-2.4.2.jar
GENDOC = $(JAVA) -jar tools/jsdoc-toolkit/jsrun.jar tools/jsdoc-toolkit/app/run.js 
COMPILE_LESS = /usr/local/bin/lessc

###                         RELEASE
##############################################################

all :: release

Debug :: debug
Release :: release

release :: clean makedirs extern_libs gesture_js_release

debug :: clean makedirs extern_libs gesture_js_debug

clean :: clean_libs

force_clean:
	-$(RM_RF) build
	-$(RM_RF) tmp

clean_libs:
	-$(RM_RF) build/vs_gesture.js
	-$(RM_RF) build/vs_gesture_min.js
	-$(RM_RF) tmp
		
makedirs:
	-$(MKPATH) build/

###                         EXPORT HEADERS / FOOTERS
##############################################################

ifdef REQUIRE_JS
  LIB_HEADER = "define ('vs_gesture', ['vs', 'vs_util', 'vs_transform'], function (vs, util) {"
  LIB_FOOTER = "return util;\n});"
else
  LIB_HEADER = "(function(){ \n\
if (typeof exports === 'undefined') { exports = this; }\n\
var vs = exports.vs, util = vs.util;\n"
  LIB_FOOTER = "}).call(this);"
endif

###                    gesture_js
##############################################################

gesture_js_release: build/vs_gesture.js
	-$(COMPILE) --js=build/vs_gesture.js --js_output_file=build/vs_gesture_min.js
	
gesture_js_debug: build/vs_gesture.js

build/vs_gesture.js: src/PointerEvent.js src/GestureEvent.js
	$(ECHO) $(LIB_HEADER) >> $@
	$(CAT) src/PointerEvent.js >> $@
	$(CAT) src/GestureEvent.js >> $@
	$(ECHO) $(LIB_FOOTER) >> $@

###                    libs
##############################################################

###                    libs
##############################################################

extern_libs: build/vs_util.js build/vs_transform.js
	
build/vs_util.js:
	-$(MKPATH) tmp/
	git clone https://github.com/dthevenin/Util.git tmp
	-$(CP) tmp/build/vs_util.js build/vs_util.js
	-$(CP) tmp/build/firminCSSMatrix.js build/firminCSSMatrix.js
	-$(CP) tmp/build/vs_util_min.js build/vs_util_min.js
	-$(CP) tmp/build/firminCSSMatrix_min.js build/firminCSSMatrix_min.js
	-$(RM_RF) tmp
	
build/vs_transform.js:
	-$(MKPATH) tmp/
	git clone https://github.com/dthevenin/Transform.git tmp
	-$(CP) tmp/build/vs_transform.js build/vs_transform.js
	-$(CP) tmp/build/vs_transform_min.js build/vs_transform_min.js
	-$(RM_RF) tmp
