import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"),
  priority: integer("priority").notNull().default(1),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  dueDate: timestamp("due_date"),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  projectId: integer("project_id").references(() => projects.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

