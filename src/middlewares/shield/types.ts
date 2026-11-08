//@ts-nocheck
import type { Rule, RuleAnd, RuleOr, RuleTrue } from "graphql-shield/typings/rules";

export type RulesList = Rule | RuleTrue | RuleAnd | RuleOr;
