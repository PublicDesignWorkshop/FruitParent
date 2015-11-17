var FoodParent;
(function (FoodParent) {
    var Model = (function () {
        function Model() {
            var that = this;
            if (Model._instance) {
                throw new Error("Error: Instantiation failed: Use Model.getInstance() instead of new.");
            }
            Model._instance = this;
            that.fetchAuths();
        }
        Model.getInstance = function () {
            return Model._instance;
        };
        Model.prototype.getFoods = function () {
            return this.foods;
        };
        Model.prototype.getTrees = function () {
            return this.trees;
        };
        Model.prototype.getOwnerships = function () {
            return this.ownerships;
        };
        Model.prototype.getFlags = function () {
            return this.flags;
        };
        Model.prototype.getNotes = function () {
            return this.notes;
        };
        Model.prototype.getAuths = function () {
            return this.auths;
        };
        Model.prototype.getPersons = function () {
            return this.persons;
        };
        Model.prototype.getAdopts = function () {
            return this.adopts;
        };
        Model.prototype.fetchAuths = function () {
            console.log("Fetch Authorizations");
            var that = this;
            if (that.auths == undefined) {
                that.auths = new FoodParent.Auths();
                var auth1 = new FoodParent.Auth({ id: 1, name: "ConcreteJungle" });
                auth1.id = 1;
                var auth2 = new FoodParent.Auth({ id: 2, name: "Participant" });
                auth2.id = 2;
                var auth3 = new FoodParent.Auth({ id: 3, name: "Manager" });
                auth3.id = 3;
                var auth4 = new FoodParent.Auth({ id: 4, name: "Unkown" });
                auth4.id = 4;
                that.auths.add(auth1);
                that.auths.add(auth2);
                that.auths.add(auth3);
                that.auths.add(auth4);
            }
        };
        Model.prototype.fetchAdopts = function (callback) {
            var that = this;
            if (that.adopts == undefined) {
                that.adopts = new FoodParent.Adopts();
            }
            that.adopts.fetch({
                remove: true,
                processData: true,
                data: {},
                success: function (collection, response, options) {
                    console.log("success fetch with " + collection.models.length + " adopt items");
                    if (callback != undefined) {
                        callback();
                    }
                },
                error: function (collection, jqxhr, options) {
                    console.log("error while fetching item data from the server");
                }
            });
        };
        Model.prototype.fetchPersons = function (callback) {
            var that = this;
            if (that.persons == undefined) {
                that.persons = new FoodParent.Persons();
            }
            that.persons.fetch({
                remove: true,
                processData: true,
                data: {},
                success: function (collection, response, options) {
                    console.log("success fetch with " + collection.models.length + " items");
                    if (callback != undefined) {
                        callback();
                    }
                },
                error: function (collection, jqxhr, options) {
                    console.log("error while fetching item data from the server");
                }
            });
        };
        Model.prototype.fetchFood = function (id) {
            var that = this;
            if (that.foods == undefined) {
                that.foods = new FoodParent.Foods();
            }
            that.foods.fetch({
                remove: true,
                processData: true,
                data: {
                    id: id,
                },
                success: function (collection, response, options) {
                    console.log("success fetch with " + collection.models.length + " items");
                    console.log(that.foods);
                },
                error: function (collection, jqxhr, options) {
                    console.log("error while fetching item data from the server");
                }
            });
        };
        Model.prototype.fetchTree = function (id, callback) {
            var that = this;
            if (that.trees == undefined) {
                that.trees = new FoodParent.Trees();
            }
            if (that.foods == undefined) {
                that.foods = new FoodParent.Foods();
            }
            that.trees.fetch({
                remove: true,
                processData: true,
                data: {
                    id: id,
                    south: 0,
                    north: 0,
                    west: 0,
                    east: 0,
                },
                success: function (collection, response, options) {
                    console.log("success fetch with " + collection.models.length + " trees");
                    that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()), callback);
                },
                error: function (collection, jqxhr, options) {
                    console.log("error while fetching item data from the server");
                    if (callback != undefined) {
                        callback();
                    }
                }
            });
        };
        Model.prototype.fetchTrees = function (bounds, callback) {
            var that = this;
            if (that.trees == undefined) {
                that.trees = new FoodParent.Trees();
            }
            if (that.foods == undefined) {
                that.foods = new FoodParent.Foods();
            }
            that.trees.fetch({
                remove: true,
                processData: true,
                data: {
                    id: -1,
                    south: bounds.getSouthEast().lat,
                    north: bounds.getNorthEast().lat,
                    west: bounds.getSouthWest().lng,
                    east: bounds.getSouthEast().lng,
                },
                success: function (collection, response, options) {
                    console.log("success fetch with " + collection.models.length + " trees");
                    that.fetchFoods(that.foods.getUndetectedIds(that.trees.getFoodIds()));
                    if (callback != undefined) {
                        callback();
                    }
                },
                error: function (collection, jqxhr, options) {
                    console.log("error while fetching item data from the server");
                }
            });
        };
        Model.prototype.fetchFoods = function (ids, callback) {
            var that = this;
            if (that.foods == undefined) {
                that.foods = new FoodParent.Foods();
            }
            if (ids.length != 0) {
                that.foods.fetch({
                    remove: true,
                    processData: true,
                    data: {
                        ids: ids.toString(),
                    },
                    success: function (collection, response, options) {
                        console.log("success fetch with " + collection.models.length + " foods");
                        FoodParent.Controller.getInstance().renderTreesOnMap();
                        if (callback != undefined) {
                            callback();
                        }
                    },
                    error: function (collection, jqxhr, options) {
                        console.log("error while fetching item data from the server");
                    }
                });
            }
            else {
                FoodParent.Controller.getInstance().renderTreesOnMap();
                if (callback != undefined) {
                    callback();
                }
            }
        };
        Model.prototype.fetchFoods2 = function (callback) {
            var that = this;
            if (that.foods == undefined) {
                that.foods = new FoodParent.Foods();
            }
            that.foods.fetch({
                remove: true,
                processData: true,
                data: {
                    ids: [-1].toString(),
                },
                success: function (collection, response, options) {
                    console.log("success fetch with " + collection.models.length + " foods");
                    if (callback != undefined) {
                        callback();
                    }
                },
                error: function (collection, jqxhr, options) {
                    console.log("error while fetching item data from the server");
                }
            });
        };
        Model.prototype.fetchFlags = function (callback, callback2) {
            var that = this;
            if (that.flags == undefined) {
                that.flags = new FoodParent.Flags();
                that.flags.fetch({
                    remove: true,
                    processData: true,
                    data: {},
                    success: function (collection, response, options) {
                        console.log("success fetch with " + collection.models.length + " flags");
                        if (callback != undefined) {
                            callback(callback2);
                        }
                    },
                    error: function (collection, jqxhr, options) {
                        console.log("error while fetching item data from the server");
                    }
                });
            }
            else {
                if (callback != undefined) {
                    callback(callback2);
                }
            }
        };
        Model.prototype.fetchTypes = function (callback, callback2) {
            var that = this;
            if (that.ownerships == undefined) {
                that.ownerships = new FoodParent.Ownerships();
                that.ownerships.fetch({
                    remove: true,
                    processData: true,
                    data: {},
                    success: function (collection, response, options) {
                        console.log("success fetch with " + collection.models.length + " types");
                        if (callback != undefined) {
                            callback(callback2);
                        }
                    },
                    error: function (collection, jqxhr, options) {
                        console.log("error while fetching item data from the server");
                    }
                });
            }
            else {
                if (callback != undefined) {
                    callback(callback2);
                }
            }
        };
        Model.prototype.fetchNotes = function (trees, size, offset, callback) {
            var that = this;
            if (that.notes == undefined) {
                that.notes = new FoodParent.Notes();
            }
            if (trees.length != 0) {
                that.notes.fetch({
                    remove: true,
                    processData: true,
                    data: {
                        trees: trees.toString(),
                        size: size,
                        offset: offset,
                    },
                    success: function (collection, response, options) {
                        console.log("success fetch with " + collection.models.length + " notes");
                        if (callback != undefined) {
                            callback();
                        }
                    },
                    error: function (collection, jqxhr, options) {
                        console.log("error while fetching item data from the server");
                    }
                });
            }
            else {
                if (callback != undefined) {
                    callback();
                }
            }
        };
        Model._instance = new Model();
        return Model;
    })();
    FoodParent.Model = Model;
})(FoodParent || (FoodParent = {}));
