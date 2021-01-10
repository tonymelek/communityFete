module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        balance: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0

        },
        role: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    // Associate Users if merchants to Shops
    User.associate = function (models) {
        User.belongsTo(models.Shop, {
            foreignKey: {
                allowNull: true,
            },
        });
        User.hasMany(models.Transaction)
        User.hasMany(models.Order)
    };

    return User;
}