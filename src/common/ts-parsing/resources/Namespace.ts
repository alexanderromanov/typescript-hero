import { Declaration } from '../declarations';
import { Export } from '../exports';
import { Import } from '../imports';
import { Node } from '../Node';
import { Module } from './Module';
import { Resource } from './Resource';
import { Serializable } from 'ts-json-serializer';

/**
 * Factory for deserializer. Creates a {@link Namespace}.
 * 
 * @param {*} json
 * @returns {Namespace}
 */
function typeFactory(json: any): Namespace {
    const obj = new Namespace(json.name, json.start, json.end);
    obj.imports = json.imports;
    obj.exports = json.exports;
    obj.declarations = json.declarations;
    obj.resources = json.resources;
    obj.usages = json.usages;
    return obj;
}

/**
 * TypeScript resource. Declaration of a typescript namespace (i.e. declare foobar).
 * 
 * @export
 * @class Namespace
 * @implements {Resource}
 * @implements {Node}
 */
@Serializable({ factory: typeFactory })
export class Namespace implements Resource, Node {
    public imports: Import[] = [];
    public exports: Export[] = [];
    public declarations: Declaration[] = [];
    public resources: Resource[] = [];
    public usages: string[] = [];

    public get identifier(): string {
        return this.name;
    }

    public get nonLocalUsages(): string[] {
        return this.usages.filter(
            usage => !this.declarations.some(o => o.name === usage) &&
                !this.resources.some(o => (o instanceof Module || o instanceof Namespace) && o.name === usage),
        );
    }

    constructor(public name: string, public start: number, public end: number) { }

    /**
     * Function that calculates the alias name of a namespace.
     * Removes all underlines and dashes and camelcases the name.
     * 
     * @returns {string}
     * 
     * @memberof Namespace
     */
    public getNamespaceAlias(): string {
        return this.name.split(/[-_]/).reduce((all, cur, idx) => {
            if (idx === 0) {
                return all + cur.toLowerCase();
            } else {
                return all + cur.charAt(0).toUpperCase() + cur.substring(1).toLowerCase();
            }
        },                                    '');
    }
}
