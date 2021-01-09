module.exports = function (sequelize, DataTypes) {
    const Shop = sequelize.define("Shop", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 15]
            }
        },
        balance: {
            type: DataTypes.FLOAT,
            allowNull: false,

        }
    })
    // Associate Users if merchants to Shops
    Shop.associate = function (models) {
        Shop.hasMany(models.User)
        Shop.hasMany(models.Transaction)
        Shop.hasMany(models.Menu)
    };

    return Shop;
}