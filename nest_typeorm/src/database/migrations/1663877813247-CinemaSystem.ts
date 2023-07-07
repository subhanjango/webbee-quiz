import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CinemaSystem1663877813247 implements MigrationInterface {
  /**
  # ToDo: Create a migration that creates all tables for the following user stories
  
  For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
  To not introduce additional complexity, please consider only one cinema.
  
  Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.
  
  ## User Stories
  
  **Movie exploration**
  * As a user I want to see which films can be watched and at what times
  * As a user I want to only see the shows which are not booked out
  
  **Show administration**
  * As a cinema owner I want to run different films at different times
  * As a cinema owner I want to run multiple films at the same time in different showrooms
  
  **Pricing**
  * As a cinema owner I want to get paid differently per show
  * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat
  
  **Seating**
  * As a user I want to book a seat
  * As a user I want to book a vip seat/couple seat/super vip/whatever
  * As a user I want to see which seats are still available
  * As a user I want to know where I'm sitting on my ticket
  * As a cinema owner I dont want to configure the seating for every show
  */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.createMoviesSchema(queryRunner);
    await this.createSeatTypeSchema(queryRunner);
    await this.createSeatingChartSchema(queryRunner);
    await this.createShowRoomsSchema(queryRunner);
    await this.createMovieShowsSchema(queryRunner);
    await this.createSeatTypesPercentagePremiums(queryRunner);
    await this.createUserSchema(queryRunner);
    await this.createMovieShowBookingsSchema(queryRunner);
  }

  private async createSeatTypeSchema(queryRunner : QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name : 'seat_types',
        columns : [
          {
            name : 'id',
            type : 'integer',
            isPrimary : true,
            isGenerated : true,
            generationStrategy : 'increment'
          },
          {
            name : 'type',
            type : 'varchar',
            length : '255'
          },
          {
            name : 'createdAt',
            type : 'timestamp',
            default : 'CURRENT_TIMESTAMP'
          }
        ]
      })
      );
  }

  private async createSeatingChartSchema(queryRunner : QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name : 'seating_charts',
        columns : [
          {
            name : 'id',
            type : 'integer',
            isPrimary : true,
            isGenerated : true,
            generationStrategy : 'increment'
          },
          {
            name : 'seat_type_id',
            type : 'integer',
            unsigned : true
          },
          {
            name : 'coordinates',
            type : 'text',
          },
          {
            name : 'quantity',
            type : 'integer',
          },
          {
            name : 'createdAt',
            type : 'timestamp',
            default : 'CURRENT_TIMESTAMP'
          }
        ]
      })
      );

      await queryRunner.createForeignKey('seating_charts' , new TableForeignKey({
        columnNames : ['seat_type_id'],
        referencedColumnNames : ['id'],
        referencedTableName : 'seat_types',
        onDelete : 'CASCADE'
      }));
  }

  private async createShowRoomsSchema(queryRunner : QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name : 'showrooms',
        columns : [
          {
            name : 'id',
            type : 'integer',
            isPrimary : true,
            isGenerated : true,
            generationStrategy : 'increment'
          },
          {
            name : 'title',
            type : 'varchar',
            length : '255'
          },
          {
            name : 'seating_chart_id',
            type : 'integer',
            unsigned : true,
          },
          {
            name : 'createdAt',
            type : 'timestamp',
            default : 'CURRENT_TIMESTAMP'
          }
        ]
      })
      );

      await queryRunner.createForeignKey('showrooms' , new TableForeignKey({
        columnNames : ['seating_chart_id'],
        referencedColumnNames : ['id'],
        referencedTableName : 'seating_charts',
        onDelete : 'CASCADE'
      }));
  }
  
  private async createMoviesSchema(queryRunner : QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name : 'movies',
        columns : [
          {
            name : 'id',
            type : 'integer',
            isPrimary : true,
            isGenerated : true,
            generationStrategy : 'increment'
          },
          {
            name : 'title',
            type : 'varchar',
            length : '255'
          },
          {
            name : 'createdAt',
            type : 'timestamp',
            default : 'CURRENT_TIMESTAMP'
          }
        ]
      })
      );
  }

  private async createMovieShowsSchema(queryRunner : QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name : 'movie_shows',
        columns : [
          {
            name : 'id',
            type : 'integer',
            isPrimary : true,
            isGenerated : true,
            generationStrategy : 'increment'
          },
          {
            name : 'movie_id',
            type : 'integer',
            unsigned : true
          },
          {
            name : 'showroom_id',
            type : 'integer',
            unsigned : true
          },
          {
            name : 'price',
            type : 'decimal',
            precision : 9,
            scale : 3
          },
          {
            name : 'showtime',
            type : 'timestamp',
          },
          {
            name : 'createdAt',
            type : 'timestamp',
            default : 'CURRENT_TIMESTAMP'
          }
        ]
      })
      );

      await queryRunner.createForeignKey('movie_shows' , new TableForeignKey({
        columnNames : ['movie_id'],
        referencedColumnNames : ['id'],
        referencedTableName : 'movies',
        onDelete : 'CASCADE'
      }));

      await queryRunner.createForeignKey('movie_shows' , new TableForeignKey({
        columnNames : ['showroom_id'],
        referencedColumnNames : ['id'],
        referencedTableName : 'showrooms',
        onDelete : 'CASCADE'
      }));
  }

  private async createSeatTypesPercentagePremiums(queryRunner : QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name : 'seat_type_percentage_premiums',
        columns : [
          {
            name : 'id',
            type : 'integer',
            isPrimary : true,
            isGenerated : true,
            generationStrategy : 'increment'
          },
          {
            name : 'seat_type_id',
            type : 'integer',
            unsigned : true
          },
          {
            name : 'premium_percentage',
            type : 'integer',
          },
          {
            name : 'createdAt',
            type : 'timestamp',
            default : 'CURRENT_TIMESTAMP'
          }
        ]
      })
      );

      await queryRunner.createForeignKey('seat_type_percentage_premiums' , new TableForeignKey({
        columnNames : ['seat_type_id'],
        referencedColumnNames : ['id'],
        referencedTableName : 'seat_types',
        onDelete : 'CASCADE'
      }));
  }

  private async createUserSchema(queryRunner : QueryRunner) {
    await queryRunner.createTable(
      new Table({
        name : 'users',
        columns : [
          {
            name : 'id',
            type : 'integer',
            isPrimary : true,
            isGenerated : true,
            generationStrategy : 'increment'
          },
          {
            name : 'name',
            type : 'varchar',
            length : '255'
          },
          {
            name : 'email',
            type : 'varchar',
            length : '255',
            isUnique : true
          },
          {
            name : 'createdAt',
            type : 'timestamp',
            default : 'CURRENT_TIMESTAMP'
          }
        ]
      })
      );
  }

  private async createMovieShowBookingsSchema(queryRunner : QueryRunner) {
   await queryRunner.createTable(
      new Table({
        name : 'movie_show_bookings',
        columns : [
          {
            name : 'id',
            type : 'integer',
            isPrimary : true,
            isGenerated : true,
            generationStrategy : 'increment'
          },
          {
            name : 'movie_show_id',
            type : 'integer',
            unsigned : true
          },
          {
            name : 'seat_type_id',
            type : 'integer',
            unsigned : true
          },
          {
            name : 'user_id',
            type : 'integer',
            unsigned : true
          },
          {
            name : 'createdAt',
            type : 'timestamp',
            default : 'CURRENT_TIMESTAMP'
          }
        ]
      })
      );

      await queryRunner.createForeignKey('movie_show_bookings' , new TableForeignKey({
        columnNames : ['movie_show_id'],
        referencedColumnNames : ['id'],
        referencedTableName : 'movie_shows',
        onDelete : 'CASCADE'
      }));

      await queryRunner.createForeignKey('movie_show_bookings' , new TableForeignKey({
        columnNames : ['seat_type_id'],
        referencedColumnNames : ['id'],
        referencedTableName : 'seat_types',
        onDelete : 'CASCADE'
      }));

      await queryRunner.createForeignKey('movie_show_bookings' , new TableForeignKey({
        columnNames : ['user_id'],
        referencedColumnNames : ['id'],
        referencedTableName : 'users',
        onDelete : 'CASCADE'
      }));
  }
    
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
  