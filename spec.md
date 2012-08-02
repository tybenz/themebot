selectors_group
  : selector [ COMMA S* selector ]*
  ;

selector
  : simple_selector_sequence [ combinator simple_selector_sequence ]*
  ;

combinator
  /* combinators can be surrounded by whitespace */
  : PLUS S* | GREATER S* | TILDE S* | S+
  ;

simple_selector_sequence
  : [ type_selector | universal ]
    [ HASH | class | attrib | pseudo | negation ]*
  | [ HASH | class | attrib | pseudo | negation ]+
  ;

type_selector
  : [ namespace_prefix ]? element_name
  ;

namespace_prefix
  : [ IDENT | '*' ]? '|'
  ;

element_name
  : IDENT
  ;

universal
  : [ namespace_prefix ]? '*'
  ;

class
  : '.' IDENT
  ;

attrib
  : '[' S* [ namespace_prefix ]? IDENT S*
        [ [ PREFIXMATCH |
            SUFFIXMATCH |
            SUBSTRINGMATCH |
            '=' |
            INCLUDES |
            DASHMATCH ] S* [ IDENT | STRING ] S*
        ]? ']'
  ;

pseudo
  /* '::' starts a pseudo-element, ':' a pseudo-class */
  /* Exceptions: :first-line, :first-letter, :before and :after. */
  /* Note that pseudo-elements are restricted to one per selector and */
  /* occur only in the last simple_selector_sequence. */
  : ':' ':'? [ IDENT | functional_pseudo ]
  ;

functional_pseudo
  : FUNCTION S* expression ')'
  ;

expression
  /* In CSS3, the expressions are identifiers, strings, */
  /* or of the form "an+b" */
  : [ [ PLUS | '-' | DIMENSION | NUMBER | STRING | IDENT ] S* ]+
  ;

negation
  : NOT S* negation_arg S* ')'
  ;

negation_arg
  : type_selector | universal | HASH | class | attrib | pseudo
  ;