export default async function (connection) {
  await connection.execute(
    `create table if not exists beer (
        id integer primary key not null,
        name text not null,
        price real not null,
        profit real not null,
        type text not null,
        totalBottle integer not null,
        stock integer not null,
        bottlePrice real not null
)`
  );
  await connection.execute(
    `create table if not exists log(
      id integer primary key not null, 
      beer integer not null, 
      type text not null,
      amount integer not null,
      price real not null,
      date text,
      foreign key(beer) references beer(id)
      )`
  );
  await connection.execute(
    `create table if not exists dept(
      id integer primary key not null,
      name text not null,
      dept real not null, 
      bottle text not null, 
      accustion text not null,
      date text
      )`
  );
}
